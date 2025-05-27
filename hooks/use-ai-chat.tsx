"use client";

import { useAIChatStore } from "@/store/ai-chat-store";

export function useAIChat() {
  const store = useAIChatStore();
  return store;
}
