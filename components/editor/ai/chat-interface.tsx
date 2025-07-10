"use client";

import { toast } from "@/components/ui/use-toast";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { useAuthStore } from "@/store/auth-store";
import { useGetProDialogStore } from "@/store/get-pro-dialog-store";
import { AIPromptData } from "@/types/ai";
import dynamic from "next/dynamic";
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
  const { generateTheme } = useAIThemeGeneration();
  const { messages, addUserMessage, addAssistantMessage, resetMessagesUpToIndex } =
    useAIChatStore();
  const hasMessages = messages.length > 0;

  const { openAuthDialog } = useAuthStore();
  const { data: session } = authClient.useSession();

  const { subscriptionStatus } = useSubscription();
  const { openGetProDialog } = useGetProDialogStore();

  const checkValidSubscription = () => {
    if (!subscriptionStatus) return;
    const { isSubscribed, requestsRemaining } = subscriptionStatus;

    if (isSubscribed) return true;

    if (requestsRemaining <= 0) {
      openGetProDialog();
      return false;
    }

    return true; // Allow if not subscribed but still has requests left
  };

  const handleThemeGeneration = async (
    promptData: AIPromptData | null,
    handlers?: { onThemeGenerateInvoked?: () => void }
  ) => {
    if (!session) {
      openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", { promptData });
      return;
    }

    if (!checkValidSubscription()) {
      return;
    }

    if (!promptData) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    addUserMessage({
      promptData,
    });

    handlers?.onThemeGenerateInvoked?.();

    const updatedMessages = useAIChatStore.getState().messages;
    const result = await generateTheme(updatedMessages);

    if (!result) {
      addAssistantMessage({
        content: "Failed to generate theme.",
      });
      return;
    }

    addAssistantMessage({
      content:
        result?.text ??
        (result?.theme ? "Here's the theme I generated for you." : "Failed to generate theme."),
      themeStyles: result?.theme,
    });
  };

  const handleRetry = async (messageIndex: number) => {
    const messageToRetry = messages[messageIndex];

    if (!messageToRetry || messageToRetry.role !== "user" || !messageToRetry.promptData) {
      toast({
        title: "Error",
        description: "Cannot retry this message.",
      });
      return;
    }

    // Reset messages up to the retry point (remove the user message and any subsequent messages)
    resetMessagesUpToIndex(messageIndex);
    await handleThemeGeneration(messageToRetry.promptData);
  };

  usePostLoginAction("AI_GENERATE_FROM_CHAT", ({ promptData }) => {
    handleThemeGeneration(promptData);
  });

  return (
    <section className="@container relative isolate z-1 mx-auto flex h-full w-full max-w-[49rem] flex-1 flex-col justify-center">
      <div
        className={cn(
          "relative flex w-full flex-1 flex-col overflow-y-hidden transition-all duration-300 ease-out"
        )}
      >
        {hasMessages ? (
          <ChatMessages onRetry={handleRetry} />
        ) : (
          <div className="animate-in fade-in-50 zoom-in-95 relative isolate px-4 pt-8 duration-300 ease-out sm:pt-16 md:pt-24">
            <NoMessagesPlaceholder handleThemeGeneration={handleThemeGeneration} />
          </div>
        )}
      </div>

      {/* Chat form input and suggestions */}
      <div className="relative mx-auto flex w-full flex-col px-4 pb-4">
        <div className="relative isolate z-10 w-full">
          <div
            className={cn(
              "transition-all ease-out",
              hasMessages ? "scale-100 opacity-100" : "h-0 scale-80 opacity-0"
            )}
          >
            <ClosableSuggestedPillActions handleThemeGeneration={handleThemeGeneration} />
          </div>
          <ChatInput handleThemeGeneration={handleThemeGeneration} />
        </div>
      </div>
    </section>
  );
}
