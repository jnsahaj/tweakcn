import { ENHANCE_PROMPT_SYSTEM } from "@/lib/ai/prompts";
import { baseProviderOptions, MODELS } from "@/lib/ai/providers";
import { AIPromptData } from "@/types/ai";
import { buildUserContentPartsFromPromptData } from "@/utils/ai/message-converter";
import { smoothStream, streamText } from "ai";

export async function POST(req: Request) {
  // TODO: Add session and subscription check, this should be a Pro only feature
  // TODO: Record AI usage, providing the model id to `recordAIUsage` function

  const body = await req.json();
  const { prompt: _prompt, promptData }: { prompt: string; promptData: AIPromptData } = body;
  const userContentParts = buildUserContentPartsFromPromptData(promptData);

  const result = streamText({
    system: ENHANCE_PROMPT_SYSTEM,
    messages: [
      {
        role: "user",
        content: userContentParts,
      },
    ],
    model: MODELS.promptEnhancement,
    providerOptions: baseProviderOptions,
    experimental_transform: smoothStream({
      delayInMs: 10,
      chunking: "word",
    }),
  });

  return result.toUIMessageStreamResponse();
}
