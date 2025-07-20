"use client";

import { useAIGenerateTheme } from "@/hooks/use-ai-generate-theme";
import { useGuards } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { AIPromptData } from "@/types/ai";
import dynamic from "next/dynamic";
import React from "react";
import { ChatInput } from "./chat-input";
import { ClosableSuggestedPillActions } from "./closeable-suggested-pill-actions";

const ChatMessages = dynamic(() => import("./chat-messages").then((mod) => mod.ChatMessages), {
  ssr: false,
});

const NoMessagesPlaceholder = dynamic(
  () => import("./no-messages-placeholder").then((mod) => mod.NoMessagesPlaceholder),
  {
    ssr: false,
  }
);

export function ChatInterface() {
  const { messages, resetMessagesUpToIndex } = useAIChatStore();
  const { generateTheme } = useAIGenerateTheme();
  const { checkValidSession, checkValidSubscription } = useGuards();

  const hasMessages = messages.length > 0;
  const [editingMessageIndex, setEditingMessageIndex] = React.useState<number | null>(null);

  const handleGenerateFromSuggestion = async (promptData: AIPromptData | null) => {
    if (!checkValidSession("signup", "AI_GENERATE_FROM_CHAT_SUGGESTION", { promptData })) return;
    if (!checkValidSubscription()) return;

    generateTheme(promptData);
  };

  const handleRetry = async (messageIndex: number) => {
    if (!checkValidSession("signup", "AI_GENERATE_RETRY", { messageIndex })) return;
    if (!checkValidSubscription()) return;

    setEditingMessageIndex(null);
    const messageToRetry = messages[messageIndex];

    if (!messageToRetry || messageToRetry.role !== "user" || !messageToRetry.promptData) {
      toast({
        title: "Error",
        description: "Cannot retry this message.",
      });
      return;
    }

    // Reset messages up to the retry point
    resetMessagesUpToIndex(messageIndex);
    generateTheme(messageToRetry.promptData);
  };

  const handleEdit = (messageIndex: number) => {
    if (!checkValidSession()) return; // Simply act as an early return

    setEditingMessageIndex(messageIndex);
  };

  const handleEditCancel = () => {
    setEditingMessageIndex(null);
  };

  const handleEditSubmit = async (messageIndex: number, promptData: AIPromptData) => {
    if (!checkValidSession("signup", "AI_GENERATE_EDIT", { messageIndex, promptData })) {
      return;
    }
    if (!checkValidSubscription()) return;

    // Reset messages up to the edited message
    resetMessagesUpToIndex(messageIndex);
    setEditingMessageIndex(null);
    generateTheme(promptData);
  };

  usePostLoginAction("AI_GENERATE_FROM_CHAT_SUGGESTION", ({ promptData }) => {
    handleGenerateFromSuggestion(promptData);
  });

  usePostLoginAction("AI_GENERATE_RETRY", ({ messageIndex }) => {
    handleRetry(messageIndex);
  });

  usePostLoginAction("AI_GENERATE_EDIT", ({ messageIndex, promptData }) => {
    handleEditSubmit(messageIndex, promptData);
  });

  return (
    <section className="@container relative isolate z-1 mx-auto flex size-full max-w-[49rem] flex-1 flex-col justify-center">
      <div
        className={cn(
          "relative flex w-full flex-1 flex-col overflow-y-hidden transition-all duration-300 ease-out"
        )}
      >
        {hasMessages ? (
          <ChatMessages
            messages={messages}
            onRetry={handleRetry}
            onEdit={handleEdit}
            onEditSubmit={handleEditSubmit}
            onEditCancel={handleEditCancel}
            editingMessageIndex={editingMessageIndex}
          />
        ) : (
          <div className="animate-in fade-in-50 zoom-in-95 relative isolate px-4 pt-8 duration-300 ease-out sm:pt-16 md:pt-24">
            <NoMessagesPlaceholder onGenerateTheme={handleGenerateFromSuggestion} />
          </div>
        )}
      </div>

      {/* Chat form input and suggestions */}
      <div className="relative isolate z-10 mx-auto w-full px-4 pb-4">
        <div
          className={cn(
            "transition-all ease-out",
            hasMessages ? "scale-100 opacity-100" : "h-0 scale-80 opacity-0"
          )}
        >
          <ClosableSuggestedPillActions onGenerateTheme={handleGenerateFromSuggestion} />
        </div>

        <ChatInput onGenerateTheme={generateTheme} />
      </div>
    </section>
  );
}
