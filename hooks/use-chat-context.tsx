"use client";

import { SUBSCRIPTION_STATUS_QUERY_KEY } from "@/hooks/use-subscription";
import { toast } from "@/hooks/use-toast";
import { useAIChatStore } from "@/store/ai-chat-store";
import { ChatMessage } from "@/types/ai";
import { applyGeneratedTheme } from "@/utils/ai/apply-theme";

import { parseAiSdkTransportError } from "@/utils/ai/parse-ai-sdk-transport-error";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";
import { createContext, useContext, useEffect, useRef } from "react";

interface ChatContext extends ReturnType<typeof useChat<ChatMessage>> {
  startNewChat: () => void;
  resetMessagesUpToIndex: (index: number) => void;
}

const ChatContext = createContext<ChatContext | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const storedMessages = useAIChatStore((s) => s.messages);
  const setStoredMessages = useAIChatStore((s) => s.setMessages);

  const hasStoreHydrated = useAIChatStore((s) => s.hasHydrated);
  const hasInitializedRef = useRef(false);

  const chat = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/generate-theme",
    }),
    onError: (error) => {
      const defaultMessage = "Failed to generate theme. Please try again.";
      const normalizedError = parseAiSdkTransportError(error, defaultMessage);

      toast({
        title: "An error occurred",
        description: normalizedError.message,
        variant: "destructive",
      });
    },
    onData: (dataPart) => {
      const { type, data } = dataPart;
      if (type === "data-generated-theme-styles") {
        if (data.status === "ready") applyGeneratedTheme(data.themeStyles);
      }
    },
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY] });
    },
  });

  const startNewChat = () => {
    chat.stop();
    chat.setMessages([]);
  };

  const resetMessagesUpToIndex = (index: number) => {
    const newMessages = chat.messages.slice(0, index);
    chat.setMessages(newMessages);
  };

  useEffect(() => {
    if (!hasInitializedRef.current) return;

    // Only update the stored messages when the chat is not currently processing a request
    if (chat.status === "ready" || chat.status === "error") {
      console.log("----- ✅ Updating Stored Messages -----");
      setStoredMessages(chat.messages);
    }
  }, [chat.status, chat.messages]);

  useEffect(() => {
    if (!hasStoreHydrated || hasInitializedRef.current) return;

    if (storedMessages.length > 0) {
      console.log("----- ☑️ Populating Chat with Stored Messages -----");
      chat.setMessages(storedMessages);
    }

    hasInitializedRef.current = true;
  }, [hasStoreHydrated, storedMessages]);

  return (
    <ChatContext.Provider value={{ ...chat, startNewChat, resetMessagesUpToIndex }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within an ChatProvider");
  }
  return ctx;
}
