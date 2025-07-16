import { AssistantMessage, ChatMessage, UserMessage } from "@/types/ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { idbStorage } from "./idb-storage";

interface AIChatStore {
  messages: ChatMessage[];
  getDefaultMessage: () => ChatMessage;
  addMessage: (message: ChatMessage) => void;
  addUserMessage: (message: UserMessage) => void;
  addAssistantMessage: (message: AssistantMessage) => void;
  clearMessages: () => void;
  resetMessagesUpToIndex: (index: number) => void;
}

export const useAIChatStore = create<AIChatStore>()(
  persist(
    (set) => ({
      messages: [],
      getDefaultMessage: () => {
        const defaultMessage: ChatMessage = {
          id: "default-message",
          content: "How can I help you theme?",
          role: "assistant",
          timestamp: Date.now(),
        };

        return defaultMessage;
      },
      addMessage: (message: ChatMessage) => {
        set((state) => ({ messages: [...state.messages, message] }));
      },
      addUserMessage: (message: UserMessage) => {
        const userMessage: ChatMessage = {
          id: crypto.randomUUID(),
          promptData: message.promptData,
          role: "user",
          timestamp: Date.now(),
        };

        set((state) => ({ messages: [...state.messages, userMessage] }));
      },
      addAssistantMessage: (message: AssistantMessage) => {
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content: message.content,
          themeStyles: message.themeStyles,
          isError: message.isError,
          role: "assistant",
          timestamp: Date.now(),
        };

        set((state) => ({ messages: [...state.messages, assistantMessage] }));
      },
      clearMessages: () => {
        set({ messages: [] });
      },
      resetMessagesUpToIndex: (index: number) => {
        set((state) => ({ messages: state.messages.slice(0, index) }));
      },
    }),
    {
      name: "ai-chat-storage",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

export const getUserMessagesCount = (messages: ChatMessage[]) => {
  return messages.filter((message) => message.role === "user").length;
};

export const getUserMessages = (messages: ChatMessage[]) => {
  return messages.filter((message) => message.role === "user");
};

export const getAssistantMessages = (messages: ChatMessage[]) => {
  return messages.filter((message) => message.role === "assistant");
};

export const getLastUserMessage = (messages: ChatMessage[]) => {
  const userMessages = getUserMessages(messages);
  return userMessages[userMessages.length - 1];
};
