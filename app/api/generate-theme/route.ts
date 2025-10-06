import { recordAIUsage } from "@/actions/ai-usage";
import { THEME_GENERATION_TOOLS } from "@/lib/ai/generate-theme/tools";
import { GENERATE_THEME_SYSTEM } from "@/lib/ai/prompts";
import { baseProviderOptions, myProvider } from "@/lib/ai/providers";
import { MAX_MESSAGES_WINDOW } from "@/lib/constants";
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
    const trimmedMessages = messages.slice(-MAX_MESSAGES_WINDOW); // Trim the messages to avoid exponential growth
    const modelMessages = await convertMessagesToModelMessages(trimmedMessages);

    const stream = createUIMessageStream<ChatMessage>({
      execute: ({ writer }) => {
        const context: AdditionalAIContext = { writer };
        const model = myProvider.languageModel("theme-generation");

        const result = streamText({
          abortSignal: req.signal,
          model: model,
          providerOptions: baseProviderOptions,
          system: GENERATE_THEME_SYSTEM,
          messages: modelMessages,
          tools: THEME_GENERATION_TOOLS,
          stopWhen: stepCountIs(2),
          onError: (error) => {
            if (error instanceof Error) console.error(error);
          },
          onFinish: async (result) => {
            const { totalUsage } = result;
            try {
              await recordAIUsage({
                modelId: model.modelId,
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
