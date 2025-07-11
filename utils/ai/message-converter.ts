import { ChatMessage } from "@/types/ai";
import { buildPromptForAPI } from "@/utils/ai/ai-prompt";
import { CoreMessage, ImagePart, TextPart, UserContent } from "ai";

export async function convertChatMessagesToCoreMessages(
  messages: ChatMessage[]
): Promise<CoreMessage[]> {
  const coreMessages: CoreMessage[] = [];

  for (const message of messages) {
    if (message.role === "user" && message.promptData) {
      const content: UserContent = [];
      const { promptData } = message;

      // Add image parts
      if (promptData.images && promptData.images.length > 0) {
        const imageParts = promptData.images.map(
          (image): ImagePart => ({
            type: "image",
            image: image.url,
          })
        );
        content.push(...imageParts);
      }

      // Add text part
      const textContent = buildPromptForAPI(promptData);
      if (textContent.trim().length > 0) {
        const textPart: TextPart = {
          type: "text",
          text: textContent,
        };
        content.push(textPart);
      }

      coreMessages.push({
        role: "user",
        content,
      });
    } else if (message.role === "assistant" && message.content) {
      let content = message.content;
      if (message.themeStyles) {
        content = `${content}\n\n${JSON.stringify(message.themeStyles)}`;
      }

      coreMessages.push({
        role: "assistant",
        content,
      });
    }
  }

  return coreMessages;
}
