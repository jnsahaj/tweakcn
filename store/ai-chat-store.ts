import { AssistantMessage, ChatMessage, UserMessage } from "@/types/ai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AIChatStore {
  messages: ChatMessage[];
  getDefaultMessage: () => ChatMessage;
  addMessage: (message: ChatMessage) => void;
  addUserMessage: (message: UserMessage) => void;
  addAssistantMessage: (message: AssistantMessage) => void;
  clearMessages: () => void;
}

export const useAIChatStore = create<AIChatStore>()(
  persist(
    (set) => ({
      messages: [],
      getDefaultMessage: () => {
        const defaultMessage: ChatMessage = {
          id: crypto.randomUUID(),
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
          content: message.content,
          jsonContent: message.jsonContent,
          role: "user",
          timestamp: Date.now(),
        };

        set((state) => ({ messages: [...state.messages, userMessage] }));
      },
      addAssistantMessage: (message: AssistantMessage) => {
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content: message.content,
          jsonContent: message.jsonContent,
          themeStyles: message.themeStyles,
          role: "assistant",
          timestamp: Date.now(),
        };

        set((state) => ({ messages: [...state.messages, assistantMessage] }));
      },
      clearMessages: () => {
        set({ messages: [] });
      },
    }),
    {
      name: "ai-chat-storage",
    }
  )
);
