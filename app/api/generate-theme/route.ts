import { auth } from "@/lib/auth";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { themeStylePropsSchema } from "@/types/theme";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { generateObject } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});
const model = google("gemini-2.5-flash-lite-preview-06-17");

const formDataSchema = z.object({
  prompt: z
    .string()
    .min(1)
    .max(AI_PROMPT_CHARACTER_LIMIT + 4000, {
      message: `Failed to generate theme. Input character limit exceeded.`,
    }),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), {
      message: "File must be an image",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be smaller than 5MB",
    })
    .optional(),
});

// Helper function to parse and validate FormData
function parseFormData(formData: FormData) {
  const prompt = formData.get('prompt');
  const imageFile = formData.get('image');

  // Convert FormData to object for validation
  const data = {
    prompt: typeof prompt === 'string' ? prompt : undefined,
    image: imageFile instanceof File ? imageFile : undefined,
  };

  return formDataSchema.parse(data);
}

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
    const { prompt, image: imageFile } = parseFormData(formData);


    let imageBase64: string | undefined;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      imageBase64 = `data:${imageFile.type};base64,${base64}`;
    }

    const messages = imageBase64 ? [{
      role: "user" as const,
      content: [
        { type: "text" as const, text: `Analyze this image and create a shadcn/ui theme based on it. ${prompt}` },
        { type: "image" as const, image: imageBase64 }
      ]
    }] : undefined;

    const { object: theme } = await generateObject({
      model,
      schema: responseSchema,
      system: `# Role
    You are tweakcn, an expert shadcn/ui theme generator.

    # Image Analysis Instructions (when image provided)
    - Extract dominant colors, mood, and aesthetic from the image
    - Consider color harmony, contrast, and visual hierarchy
    - Translate visual elements into appropriate theme tokens

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
      prompt: imageBase64 ? undefined : `Create shadcn/ui theme for: ${prompt}`,
      messages,
    });

    return new Response(JSON.stringify(theme), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return new Response(firstError.message, { status: 400 });
    }

    return new Response("Error generating theme", { status: 500 });
  }
}
