"use client";

import { toast } from "@/components/ui/use-toast";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getUserMessagesCount, useAIChatStore } from "@/store/ai-chat-store";
import { useAuthStore } from "@/store/auth-store";
import { createCurrentThemePrompt, getTextContent, mentionsCount } from "@/utils/ai-prompt";
import { AIPromptData } from "@/types/ai";
import dynamic from "next/dynamic";
import { AIChatForm } from "./ai-chat-form";
import { ClosableSuggestedPillActions } from "./closeable-suggested-pill-actions";
import { buildPrompt } from "@/lib/ai-theme-generator";

const ChatMessages = dynamic(() => import("./chat-messages").then((mod) => mod.ChatMessages), {
  ssr: false,
});

export function AIInterface() {
  const { generateTheme } = useAIThemeGeneration();
  const { messages, addUserMessage, addAssistantMessage } = useAIChatStore();
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

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

    addUserMessage({
      promptData: promptData,
    });

    let transformedPromptData = promptData;

    if (getUserMessagesCount(messages) > 0 && mentionsCount(promptData) === 0) {
      transformedPromptData = createCurrentThemePrompt({
        prompt: getTextContent(promptData),
      });
    }

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

  usePostLoginAction("AI_GENERATE_FROM_CHAT", ({ promptData }) => {
    handleThemeGeneration(promptData);
  });

  return (
    <section className="@container relative isolate z-1 mx-auto flex h-full w-full max-w-[49rem] flex-1 flex-col justify-center">
      <div
        className={cn(
          "relative flex w-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-out"
        )}
      >
        <ChatMessages />
      </div>

      {/* Chat form input and suggestions */}
      <div className="relative mx-auto flex w-full flex-col">
        <div className="relative isolate z-10 w-full">
          <ClosableSuggestedPillActions handleThemeGeneration={handleThemeGeneration} />
          <AIChatForm handleThemeGeneration={handleThemeGeneration} />
        </div>
      </div>

      <p className="text-muted-foreground truncate py-2 text-center text-xs tracking-tight">
        tweakcn may make mistakes. Please use with discretion.
      </p>
    </section>
  );
}
