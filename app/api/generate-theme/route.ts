import { recordAICancelledRequest, recordAIUsage } from "@/actions/ai-usage";
import { handleError } from "@/lib/error-response";
import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { SubscriptionRequiredError } from "@/types/errors";
import { requestSchema, responseSchema, SYSTEM_PROMPT } from "@/utils/ai/generate-theme";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { generateText, Output } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const model = google("gemini-2.5-pro");

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

    const { messages } = requestSchema.parse(await req.json());

    const { experimental_output: result, usage } = await generateText({
      model,
      experimental_output: Output.object({
        schema: responseSchema,
      }),
      system: SYSTEM_PROMPT,
      messages,
      abortSignal: req.signal,
    });

    if (usage) {
      try {
        await recordAIUsage({
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
        });
      } catch (error) {
        logError(error as Error, { action: "recordAIUsage", usage });
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "ResponseAborted")
    ) {
      try {
        const userId = await getCurrentUserId(req);
        console.log("Recording cancelled request, userId:", userId);

        // TODO: `promptTokens` should *ideally* be set to the number of tokens in the last user message
        await recordAICancelledRequest(
          {
            promptTokens: 0,
            completionTokens: 0,
          },
          userId
        );
      } catch (e) {
        logError(e as Error, {
          message: "Failed to record cancelled request",
          route: "/api/generate-theme",
        });
      }
      return new Response("Request aborted by user", { status: 499 });
    }
    return handleError(error, { route: "/api/generate-theme" });
  }
}
