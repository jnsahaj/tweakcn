import { AI_PROMPT_CHARACTER_LIMIT, MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/constants";
import { themeStylePropsSchema } from "@/types/theme";
import { CoreUserMessage, ImagePart, TextPart, UserContent } from "ai";
import { z } from "zod";

export const SYSTEM_PROMPT = `# Role
    You are tweakcn, an expert shadcn/ui theme generator.

    # Image Analysis Instructions (when image provided)
    - If one or more images are provided (with or without a text prompt), always analyze the image(s) and extract dominant color tokens, mood, border radius, and aesthetic to create a shadcn/ui theme based on them.
    - If both images and a text prompt are provided, use the prompt as additional guidance.
    - If only a text prompt is provided (no images), generate the theme based on the prompt.
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

export const requestSchema = z
  .object({
    prompt: z
      .string()
      .max(AI_PROMPT_CHARACTER_LIMIT + 5000, {
        message: `Failed to generate theme. Input character limit exceeded.`,
      })
      .optional(),
    images: z
      .array(
        z
          .custom<File>((file) => {
            // Check if we're in a server environment
            if (typeof File === "undefined") {
              // Server-side: Check if it's a file-like object
              return file && typeof file === "object" && "type" in file && "size" in file;
            }
            // Client-side: Use instanceof check
            return file instanceof File;
          })
          .refine((file) => file.type.startsWith("image/"), {
            message: "File must be an image.",
          })
      )
      .max(MAX_IMAGE_FILES, { message: `You can upload up to ${MAX_IMAGE_FILES} images.` })
      .refine((files) => files.every((file) => file.size <= MAX_IMAGE_FILE_SIZE), {
        message: "Each image must be smaller than 5MB.",
      })
      .optional(),
  })
  .refine(
    (data) =>
      (data.prompt && data.prompt.trim().length > 0) || (data.images && data.images.length > 0),
    {
      message: "You must provide either a prompt, at least one image, or both.",
    }
  );

// Create a new schema based on themeStylePropsSchema excluding 'spacing'
const themeStylePropsWithoutSpacing = themeStylePropsSchema.omit({
  spacing: true,
});

// Define the main theme schema using the modified props schema
export const responseSchema = z.object({
  text: z.string().describe("A concise paragraph on the generated theme"),
  theme: z.object({
    light: themeStylePropsWithoutSpacing,
    dark: themeStylePropsWithoutSpacing,
  }),
});

export async function getImageBase64(imageFile: File) {
  if (!imageFile) return;

  const arrayBuffer = await imageFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const imageBase64 = `data:${imageFile.type};base64,${base64}`;
  return imageBase64;
}

export async function getMessages(
  prompt?: string,
  imageFiles?: File[]
): Promise<CoreUserMessage[]> {
  const content: UserContent = [];

  // Add image parts
  if (imageFiles && imageFiles.length > 0) {
    const imageParts = await Promise.all(
      imageFiles.map(async (imageFile): Promise<ImagePart | null> => {
        const result = await getImageBase64(imageFile);
        return result ? { type: "image", image: result } : null;
      })
    );
    content.push(...imageParts.filter((part): part is ImagePart => part !== null));
  }

  // Add text part
  if (prompt && prompt.trim().length > 0) {
    const textPart: TextPart = {
      type: "text",
      text: prompt.trim(),
    };
    content.push(textPart);
  }

  const userMessage: CoreUserMessage = {
    role: "user",
    content,
  };

  return [userMessage];
}
