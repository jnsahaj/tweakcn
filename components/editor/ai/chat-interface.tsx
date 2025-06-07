"use client";

import { toast } from "@/components/ui/use-toast";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { buildPrompt } from "@/lib/ai-theme-generator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { useAuthStore } from "@/store/auth-store";
import { AIPromptData } from "@/types/ai";
import { attachLastGeneratedThemeMention, mentionsCount } from "@/utils/ai-prompt";
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
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  const hasMessages = messages.length > 0;

  const handleThemeGeneration = async (promptData: AIPromptData | null) => {
    if (!session) {
      openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", { promptData });
      return;
    }

    if (!promptData) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    let transformedPromptData = promptData;

    if (mentionsCount(promptData) === 0) {
      transformedPromptData = attachLastGeneratedThemeMention(promptData);
    }

    addUserMessage({
      promptData: transformedPromptData,
    });

    const result = await generateTheme(buildPrompt(transformedPromptData));

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

    // Resend the prompt
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
