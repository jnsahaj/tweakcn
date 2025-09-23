import { AIPromptData, ChatMessage } from "@/types/ai";
import { buildMentionStringForAPI, dedupeMentionReferences } from "@/utils/ai/ai-prompt";
import { AssistantContent, ModelMessage, TextPart, UserContent } from "ai";

export function buildUserContentPartsFromPromptData(promptData: AIPromptData): UserContent {
  const userContentParts: UserContent = [];

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

          userContentParts.push({
            type: "text",
            text: `Here is an SVG image for analysis:\n\`\`\`svg\n${svgMarkup}\n\`\`\``,
          });
        } catch {
          userContentParts.push({
            type: "image",
            image: image.url,
          });
        }
      } else {
        userContentParts.push({
          type: "image",
          image: image.url,
        });
      }
    });
  }

  // Add the prompt text content as a text part
  const textContent = promptData.content;
  if (textContent.trim().length > 0) {
    const textPart: TextPart = {
      type: "text",
      text: textContent,
    };
    userContentParts.push(textPart);
  }

  const uniqueMentions = dedupeMentionReferences(promptData.mentions);
  // Add each mention as a text part
  uniqueMentions.forEach((mention) => {
    userContentParts.push({
      type: "text",
      text: buildMentionStringForAPI(mention),
    });
  });

  return userContentParts;
}

export async function convertMessagesToModelMessages(
  messages: ChatMessage[]
): Promise<ModelMessage[]> {
  const modelMessages: ModelMessage[] = [];

  for (const message of messages) {
    const promptData = message.metadata?.promptData;
    const themeStyles = message.metadata?.themeStyles;

    const msgTextContent = message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");

    if (message.role === "user" && promptData) {
      const userContentParts = buildUserContentPartsFromPromptData(promptData);

      modelMessages.push({
        role: "user",
        content: userContentParts,
      });
    }

    if (message.role === "assistant") {
      const assistantContentParts: AssistantContent = [];
      assistantContentParts.push({
        type: "text",
        text: msgTextContent,
      });

      // If the assistant message has themeStyles attached to the metadata,
      // we need to add it to the assistant content to provide more context for the next generations
      if (themeStyles) {
        assistantContentParts.push({
          type: "text",
          text: JSON.stringify(themeStyles),
        });
      }

      modelMessages.push({
        role: "assistant",
        content: assistantContentParts,
      });
    }
  }

  return modelMessages;
}
