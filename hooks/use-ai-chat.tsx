"use client";

import { AssistantMessage, ChatMessage, UserMessage } from "@/types/ai";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AIChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  addUserMessage: (message: UserMessage) => void;
  addAssistantMessage: (message: AssistantMessage) => void;
  clearMessages: () => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);
const CHAT_MESSAGES_KEY = "ai-chat-messages";

const getInitialMessage = (): ChatMessage[] => {
  return [
    {
      id: crypto.randomUUID(),
      content: "How can I help you theme?",
      role: "assistant",
      timestamp: Date.now(),
    },
  ];
};

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessage());

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error("Failed to parse stored messages:", error);
        localStorage.removeItem(CHAT_MESSAGES_KEY);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const addUserMessage = (message: UserMessage) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: message.content,
      jsonContent: message.jsonContent,
      role: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  const addAssistantMessage = (message: AssistantMessage) => {
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: message.content,
      jsonContent: message.jsonContent,
      themeStyles: message.themeStyles,
      role: "assistant",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const clearMessages = () => {
    setMessages(getInitialMessage());
  };

  const chat = {
    messages,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
  };

  return <AIChatContext value={chat}>{children}</AIChatContext>;
}

export function useAIChat() {
  const context = useContext(AIChatContext);

  if (context === undefined) {
    throw new Error("useAIChat must be used within a AIChatProvider");
  }

  return context;
}
