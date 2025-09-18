import { recordAIUsage } from "@/actions/ai-usage";
import { THEME_GENERATION_TOOLS } from "@/lib/ai/generate-theme/tools";
import { GENERATE_THEME_SYSTEM } from "@/lib/ai/prompts";
import { baseProviderOptions, MODELS } from "@/lib/ai/providers";
import { handleError } from "@/lib/error-response";
import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { AdditionalAIContext, ChatMessage } from "@/types/ai";
import { SubscriptionRequiredError } from "@/types/errors";
import { convertMessagesToModelMessages } from "@/utils/ai/message-converter";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { createUIMessageStream, createUIMessageStreamResponse, stepCountIs, streamText } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "60s"),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const headersList = await headers();

    if (process.env.NODE_ENV !== "development") {
      const ip = headersList.get("x-forwarded-for") ?? "anonymous";
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    }

    const subscriptionCheck = await validateSubscriptionAndUsage(userId);

    if (!subscriptionCheck.canProceed) {
      throw new SubscriptionRequiredError(subscriptionCheck.error, {
        requestsRemaining: subscriptionCheck.requestsRemaining,
      });
    }

    const { messages }: { messages: ChatMessage[] } = await req.json();
    const modelMessages = await convertMessagesToModelMessages(messages);

    const stream = createUIMessageStream<ChatMessage>({
      execute: ({ writer }) => {
        const context: AdditionalAIContext = { writer };

        const result = streamText({
          abortSignal: req.signal,
          model: MODELS.themeGeneration,
          providerOptions: baseProviderOptions,
          system: GENERATE_THEME_SYSTEM,
          messages: modelMessages,
          tools: THEME_GENERATION_TOOLS,
          stopWhen: stepCountIs(5),
          onError: (error) => {
            if (error instanceof Error) console.error(error);
          },
          onFinish: async (result) => {
            const { totalUsage } = result;
            try {
              await recordAIUsage({
                promptTokens: totalUsage.inputTokens,
                completionTokens: totalUsage.outputTokens,
              });
            } catch (error) {
              logError(error as Error, { action: "recordAIUsage", totalUsage });
            }
          },
          experimental_context: context,
        });

        writer.merge(
          result.toUIMessageStream({
            messageMetadata: ({ part }) => {
              // `toolName` is not typed for some reason, must be kept in sync with the actual tool names
              if (part.type === "tool-result" && part.toolName === "generateTheme") {
                return { themeStyles: part.output };
              }
            },
          })
        );
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "ResponseAborted")
    ) {
      return new Response("Request aborted by user", { status: 499 });
    }

    return handleError(error, { route: "/api/generate-theme" });
  }
}
