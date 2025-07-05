import { auth } from "@/lib/auth";
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
import { recordAIUsage } from "@/actions/ai-usage";
import { logError } from "@/lib/shared";
import { requireSubscriptionOrFreeUsage } from "@/lib/subscription";
import { handleError } from "@/lib/error-response";

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
    const session = await auth.api.getSession(req);
    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

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

    await requireSubscriptionOrFreeUsage(req);

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

    return new Response(JSON.stringify(theme), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error, { route: "/api/generate-theme" });
  }
}
