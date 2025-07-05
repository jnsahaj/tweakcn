import { MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/ai/ai-theme-generator";
import { auth } from "@/lib/auth";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { themeStylePropsSchema } from "@/types/theme";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { CoreMessage, generateText, Output } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { z } from "zod";

// Google AI
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// TODO: Adjust model depending on the user's tier (free, Pro)
const model = google("gemini-2.5-pro");

const requestSchema = z.object({
  prompt: z
    .string()
    .min(1)
    .max(AI_PROMPT_CHARACTER_LIMIT + 5000, {
      message: `Failed to generate theme. Input character limit exceeded.`,
    }),
  images: z
    .array(
      z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: "File must be an image",
      })
    )
    .max(MAX_IMAGE_FILES, { message: `You can upload up to ${MAX_IMAGE_FILES} images.` })
    .refine((files) => files.every((file) => file.size <= MAX_IMAGE_FILE_SIZE), {
      message: "Each image must be smaller than 5MB",
    })
    .optional(),
});

// Helper function to parse and validate FormData
function parseFormData(formData: FormData) {
  const prompt = formData.get("prompt");

  // Only keep File instances (FormData.getAll can return strings if no file is uploaded)
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File);
  // Convert FormData to object for validation
  const data = { prompt, images: imageFiles };
  return requestSchema.parse(data);
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
    const { prompt, images: imageFiles } = parseFormData(formData);

    const messages = await getMessages(prompt, imageFiles);

    // Now, it is possible to add Tools (i.e. a tool to process the image)
    const { experimental_output: theme } = await generateText({
      experimental_output: Output.object({
        schema: responseSchema,
      }),
      model,
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

const SYSTEM_PROMPT = `# Role
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
    - When a base theme is specified in the prompt (denoted as @[base_theme]), begin with those values and modify only the tokens that are explicitly requested for change.
    - Output JSON matching schema exactly
    - Colors: HEX only (#RRGGBB), do NOT output rgba()
    - Shadows: Don't modify shadows unless requested. Shadow Opacity is handled separately (e.g., via \`--shadow-opacity\`);
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
    Fill the \`text\` field in a friendly way, for example: "I've generated..." or "Alright, I've whipped up..."`;

async function getImageBase64(imageFile: File) {
  if (!imageFile) return;

  const arrayBuffer = await imageFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const imageBase64 = `data:${imageFile.type};base64,${base64}`;
  return imageBase64;
}

async function getMessages(prompt?: string, imageFiles?: File[]): Promise<CoreMessage[]> {
  let imageParts: string[] = [];

  if (imageFiles && imageFiles.length > 0) {
    imageParts = await Promise.all(
      imageFiles.map(async (imageFile) => {
        const result = await getImageBase64(imageFile);
        return result || "";
      })
    );
    imageParts = imageParts.filter((part) => !!part);
  }

  // https://ai-sdk.dev/docs/reference/ai-sdk-core/core-message#imagepart
  const imageContentParts = imageParts.map((imagePart) => ({
    type: "image" as const,
    image: imagePart,
  }));

  if (imageContentParts.length > 0) {
    return [
      {
        role: "user",
        content: [
          ...imageContentParts,
          {
            type: "text",
            text: `Analyze these image(s) and extract the color tokens to create a shadcn/ui theme based on them. ${prompt ?? ""}`.trim(),
          },
        ],
      },
    ];
  } else {
    return [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Create shadcn/ui theme for: ${prompt}`.trim(),
          },
        ],
      },
    ];
  }
}
