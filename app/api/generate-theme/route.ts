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
import { z } from "zod";

// Google AI
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// TODO: Adjust model depending on the user's tier (free, Pro)
const model = google("gemini-2.5-pro");

// Helper function to parse and validate FormData
function parseFormData(formData: FormData) {
  const prompt = formData.get("prompt") || undefined;
  // Only keep File instances (FormData.getAll can return strings if no file is uploaded)
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File);
  // Convert FormData to object for validation
  const data = { prompt, images: imageFiles };
  return requestSchema.parse(data);
}

// Create Rate limit - 5 requests per 60 seconds
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

    // Skip rate limiting in development environment
    if (process.env.NODE_ENV !== "development") {
      // Apply rate limiting based on the request IP
      const ip = headersList.get("x-forwarded-for") ?? "anonymous";
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      // Block the request if rate limit exceeded
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

    const formData = await req.formData();
    const { prompt, images: imageFiles } = parseFormData(formData);

    const messages = await getMessages(prompt, imageFiles);
    // TODO: Remove this, it's for debugging
    console.dir(messages, { depth: null });

    // Now, it is possible to add Tools (i.e. a tool to process the image)
    const { experimental_output: theme } = await generateText({
      model,
      experimental_output: Output.object({
        schema: responseSchema,
      }),
      system: SYSTEM_PROMPT,
      messages,
    });

    return new Response(JSON.stringify(theme), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return new Response(firstError.message, {
        status: 400,
      });
    }

    // Consider more specific error handling based on AI SDK errors if needed
    return new Response("Error generating theme", { status: 500 });
  }
}
