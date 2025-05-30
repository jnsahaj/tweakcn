import { auth } from "@/lib/auth";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { themeStylePropsSchema } from "@/types/theme";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { generateObject } from "ai";
import { createFallback } from "ai-fallback";
import { NextRequest } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  prompt: z
    .string()
    .min(1)
    .max(AI_PROMPT_CHARACTER_LIMIT + 4000, {
      message: `Failed to generate theme. Input character limit exceeded.`,
    }),
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
      system: `# Role
    You are tweakcn, an expert shadcn/ui theme generator.

    # Token Groups
    - **Brand**: primary, secondary, accent, ring
    - **Surfaces**: background, card, popover, muted, sidebar
    - **Typography**: font-sans, font-serif, font-mono
    - **Contrast pairs**: Some colors have a -foreground counterpart for text, (e.g., primary/primary-foreground, secondary/secondary-foreground)

    # Rules **IMPORTANT**
    - Output JSON matching schema exactly
    - Colors: HEX only (#RRGGBB), do NOT output rgba()
    - Shadows: Shadow Opacity is handled separately (e.g., via \`--shadow-opacity\`);
    - Generate harmonious light/dark modes
    - Ensure contrast for base/foreground pairs
    - Don't change typography unless requested

    # Color Change Logic
    - "Make it [color]" → modify brand colors only
    - "Background darker/lighter" → modify surface colors only
    - Specific tokens requests → change those tokens + their direct foreground pairs
    - "Change [colors] in light/dark mode" → change those colors only in the requested mode, leave the other mode unchanged. (e.g. "Make primary color in light mode a little darker" → only change primary in light mode, keep dark mode unchanged)
    - Maintain color harmony across all related tokens

    # Text Description
    Fill the \`text\` field in a friendly way, for example: "I've generated..." or "Alright, I've whipped up..."`,
      prompt: `Create shadcn/ui theme for: ${prompt}`,
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
