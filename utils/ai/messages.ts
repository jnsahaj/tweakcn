import { MAX_CHAT_REQUEST_BYTES } from "@/lib/constants";
import { ChatMessage } from "@/types/ai";

function filterMessagesToDisplay(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((message) => {
    const hasTextPart = message.parts.some((part) => part.type === "text" && Boolean(part.text));
    const images = message.metadata?.promptData?.images;
    const hasAttachments = images && images.length > 0;
    return hasTextPart || hasAttachments;
  });
}

function getUserMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((message) => message.role === "user");
}

function getLastUserMessage(messages: ChatMessage[]): ChatMessage | undefined {
  return getUserMessages(messages).at(-1);
}

function getAssistantMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((message) => message.role === "assistant");
}

function getLastAssistantMessage(messages: ChatMessage[]): ChatMessage | undefined {
  return getAssistantMessages(messages).at(-1);
}

function withoutImages(message: ChatMessage): ChatMessage {
  const promptData = message.metadata?.promptData;
  if (!promptData) return message;

  return {
    ...message,
    metadata: { ...message.metadata, promptData: { ...promptData, images: [] } },
  };
}

/**
 * Uploaded images ride along as base64 in the message metadata, and the whole history is sent
 * on every request. Long conversations can therefore outgrow the request body limit, which the
 * platform rejects before the route runs. Drop the attachments of the oldest messages first —
 * losing context from earlier images beats failing the request outright.
 */
function trimMessagesToRequestBudget(
  messages: ChatMessage[],
  budgetBytes: number = MAX_CHAT_REQUEST_BYTES
): ChatMessage[] {
  const encoder = new TextEncoder();
  const sizeOf = (msgs: ChatMessage[]) => encoder.encode(JSON.stringify(msgs)).length;

  if (sizeOf(messages) <= budgetBytes) return messages;

  const trimmed = [...messages];
  for (let i = 0; i < trimmed.length; i++) {
    const images = trimmed[i].metadata?.promptData?.images;
    if (!images || images.length === 0) continue;

    trimmed[i] = withoutImages(trimmed[i]);
    if (sizeOf(trimmed) <= budgetBytes) break;
  }

  return trimmed;
}

export {
  filterMessagesToDisplay,
  getAssistantMessages,
  getLastAssistantMessage,
  getLastUserMessage,
  getUserMessages,
  trimMessagesToRequestBudget,
};
