import { createGroq } from "@ai-sdk/groq";
import { createFallback } from "ai-fallback";
import { generateObject } from "ai";
import { z } from "zod";
import { themeStylePropsSchema } from "@/types/theme";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { auth } from "@/lib/auth";

const requestSchema = z.object({
  prompt: z.string().min(1),
});

// Create a new schema based on themeStylePropsSchema excluding 'spacing'
const themeStylePropsWithoutSpacing = themeStylePropsSchema.omit({
  spacing: true,
});

// Define the main theme schema using the modified props schema
const responseSchema = z.object({
  text: z.string().describe("A concise paragraph on the generated theme"),
  theme: z.object({
    light: themeStylePropsWithoutSpacing,
    dark: themeStylePropsWithoutSpacing,
  }),
});

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

    // Skip rate limiting in development environment
    if (process.env.NODE_ENV !== "development") {
      // Apply rate limiting based on the request IP
      const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
      const { success } = await ratelimit.limit(ip);

      // Block the request if rate limit exceeded
      if (!success) {
        return new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
        });
      }
    }

    const body = await req.json();
    const { prompt } = requestSchema.parse(body);

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const model = createFallback({
      models: [groq("llama-3.3-70b-versatile"), google("gemini-2.0-flash-lite")],
      onError: (error, modelId) => {
        console.error(`Error with model ${modelId}:`, error);
      },
      modelResetInterval: 60000, // Reset to first model after 1 minute of the first error
    });

    const { object: theme } = await generateObject({
      model,
      schema: responseSchema,
      system: `You are tweakcn, an expert shadcn/ui theme generator.
Output JSON strictly matching the schema.
- Colors: HEX ONLY (#RRGGBB).
- Shadows: \`--shadow-color\` (or similar) must be HEX. Opacity is handled separately (e.g., via \`--shadow-opacity\`); do NOT output \`rgba()\` strings for color values.
- Cohesion: Create harmonious light/dark modes. If the main color changes (e.g., "make it green"), adjust \`--primary\` and related colors (\`--accent\`, \`--secondary\`, \`--ring\`, \`--border\`) for a cohesive new palette.
- Contrast: Ensure high contrast for foreground/background color pairs for accessibility.
- Description: In the \`text\` field, begin your friendly descriptive paragraph with a phrase like "I've generated ..." or "Alright, I've whipped up ...`,
      prompt: `Generate Shadcn theme. Input: ${prompt}`,
    });

    return new Response(JSON.stringify(theme), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    // Consider more specific error handling based on AI SDK errors if needed
    return new Response("Error generating theme", { status: 500 });
  }
}
