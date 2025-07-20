import { ChatMessage } from "@/types/ai";
import { buildPromptForAPI } from "@/utils/ai/ai-prompt";
import { CoreMessage, TextPart, UserContent } from "ai";

export async function convertChatMessagesToCoreMessages(
  messages: ChatMessage[]
): Promise<CoreMessage[]> {
  const coreMessages: CoreMessage[] = [];

  for (const message of messages) {
    if (message.role === "user" && message.promptData) {
      const content: UserContent = [];
      const { promptData } = message;

      if (promptData.images && promptData.images.length > 0) {
        promptData.images.forEach((image) => {
          if (image.url.startsWith("data:image/svg+xml")) {
            try {
              const dataUrlPart = image.url.split(",")[1];
              let svgMarkup: string;

              if (image.url.includes("base64")) {
                svgMarkup = atob(dataUrlPart);
              } else {
                svgMarkup = decodeURIComponent(dataUrlPart);
              }

              content.push({
                type: "text",
                text: `Here is an SVG image for analysis:\n\`\`\`svg\n${svgMarkup}\n\`\`\``,
              });
            } catch (error) {
              content.push({
                type: "image",
                image: image.url,
              });
            }
          } else {
            content.push({
              type: "image",
              image: image.url,
            });
          }
        });
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
