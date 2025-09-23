"use client";

import { useChatContext } from "@/hooks/use-chat-context";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { useGuards } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import dynamic from "next/dynamic";
import React from "react";
import { ChatInput } from "./chat-input";
import { ClosableSuggestedPillActions } from "./closeable-suggested-pill-actions";

const Messages = dynamic(() => import("./messages").then((mod) => mod.Messages), {
  ssr: false,
});

const NoMessagesPlaceholder = dynamic(
  () => import("./no-messages-placeholder").then((mod) => mod.NoMessagesPlaceholder),
  {
    ssr: false,
  }
);

export function ChatInterface() {
  const { messages, regenerate, resetMessagesUpToIndex } = useChatContext();
  const { isGeneratingTheme, generateThemeCore, cancelThemeGeneration } =
    useAIThemeGenerationCore();

  const { checkValidSession, checkValidSubscription } = useGuards();

  const hasMessages = messages.length > 0;
  const [editingMessageIndex, setEditingMessageIndex] = React.useState<number | null>(null);

  const handleGenerateFromSuggestion = (promptData: AIPromptData | undefined) => {
    if (!checkValidSession("signup", "AI_GENERATE_FROM_CHAT_SUGGESTION", { promptData })) return;
    if (!checkValidSubscription()) return;

    generateThemeCore(promptData);
  };

  const handleRetry = (messageIndex: number) => {
    if (!checkValidSession("signup", "AI_GENERATE_RETRY", { messageIndex })) return;
    if (!checkValidSubscription()) return;

    setEditingMessageIndex(null);
    const messageToRetry = messages[messageIndex];

    if (messageToRetry) {
      regenerate({ messageId: messageToRetry.id });
    } else {
      toast({
        title: "Cannot retry this message",
        description: "Seems like this message is not longer available.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (messageIndex: number) => {
    if (!checkValidSession()) return; // Simply act as an early return

    setEditingMessageIndex(messageIndex);
  };

  const handleEditCancel = () => {
    setEditingMessageIndex(null);
  };

  const handleEditSubmit = (messageIndex: number, promptData: AIPromptData) => {
    if (!checkValidSession("signup", "AI_GENERATE_EDIT", { messageIndex, promptData })) {
      return;
    }
    if (!checkValidSubscription()) return;

    // Reset messages up to the edited message
    resetMessagesUpToIndex(messageIndex);
    setEditingMessageIndex(null);
    generateThemeCore(promptData);
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
          "relative flex size-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-out"
        )}
      >
        {hasMessages ? (
          <Messages
            messages={messages}
            onRetry={handleRetry}
            onEdit={handleEdit}
            onEditSubmit={handleEditSubmit}
            onEditCancel={handleEditCancel}
            editingMessageIndex={editingMessageIndex}
            isGeneratingTheme={isGeneratingTheme}
          />
        ) : (
          <div className="animate-in fade-in-50 zoom-in-95 relative isolate px-4 pt-8 duration-300 ease-out sm:pt-16 md:pt-24">
            <NoMessagesPlaceholder
              onGenerateTheme={handleGenerateFromSuggestion}
              isGeneratingTheme={isGeneratingTheme}
            />
          </div>
        )}
      </div>

      {/* Chat form input and suggestions */}
      <div className="relative z-1 mx-auto w-full px-4 pb-4">
        <div
          className={cn(
            "transition-all ease-out",
            hasMessages ? "scale-100 opacity-100" : "h-0 scale-80 opacity-0"
          )}
        >
          <ClosableSuggestedPillActions
            onGenerateTheme={handleGenerateFromSuggestion}
            isGeneratingTheme={isGeneratingTheme}
          />
        </div>

        <ChatInput
          onThemeGeneration={generateThemeCore}
          isGeneratingTheme={isGeneratingTheme}
          onCancelThemeGeneration={cancelThemeGeneration}
        />
      </div>
    </section>
  );
}
