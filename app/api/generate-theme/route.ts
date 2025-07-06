import { recordAIUsage } from "@/actions/ai-usage";
import { handleError } from "@/lib/error-response";
import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { SubscriptionRequiredError } from "@/types/errors";
import {
  getMessages,
  requestSchema,
  responseSchema,
  SYSTEM_PROMPT,
} from "@/utils/ai/generate-theme";
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

function parseFormData(formData: FormData) {
  const prompt = formData.get("prompt") || undefined;
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File);
  const data = { prompt, images: imageFiles };
  return requestSchema.parse(data);
}

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

    const formData = await req.formData();
    const { prompt, images: imageFiles } = parseFormData(formData);
    const messages = await getMessages(prompt, imageFiles);

    const { experimental_output: theme, usage } = await generateText({
      model,
      experimental_output: Output.object({
        schema: responseSchema,
      }),
      system: SYSTEM_PROMPT,
      messages,
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

    const updatedSubscriptionStatus = {
      isSubscribed: subscriptionCheck.isSubscribed,
      requestsRemaining: subscriptionCheck.isSubscribed
        ? -1
        : Math.max(0, subscriptionCheck.requestsRemaining - 1),
    };

    return new Response(
      JSON.stringify({
        ...theme,
        subscriptionStatus: updatedSubscriptionStatus,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleError(error, { route: "/api/generate-theme" });
  }
}
