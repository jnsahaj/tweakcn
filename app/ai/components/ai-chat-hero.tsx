"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { useAIChatStore } from "@/store/ai-chat-store";
import { useAuthStore } from "@/store/auth-store";
import { AIPromptData } from "@/types/ai";
import { useRouter } from "next/navigation";
import { AIChatForm } from "./ai-chat-form";
import { ChatHeading } from "./chat-heading";
import { SuggestedPillActions } from "./suggested-pill-actions";
import { buildPrompt } from "@/lib/ai/ai-theme-generator";

export function AIChatHero() {
  const { addUserMessage, addAssistantMessage, clearMessages } = useAIChatStore();
  const router = useRouter();
  const { generateTheme } = useAIThemeGeneration();
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  const handleRedirectAndThemeGeneration = async (promptData: AIPromptData | null) => {
    if (!session) {
      if (promptData) {
        openAuthDialog("signup", "AI_GENERATE_FROM_PAGE", { promptData });
      }
      return;
    }

    if (!promptData) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    // Clear the messages when the user starts a chat from the '/ai' page
    clearMessages();

    addUserMessage({
      promptData,
    });

    router.push("/editor/theme?tab=ai");

    const builtPrompt = buildPrompt(promptData);
    const result = await generateTheme(builtPrompt.text, builtPrompt.imageFiles);

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

  usePostLoginAction("AI_GENERATE_FROM_PAGE", ({ promptData }) => {
    if (!promptData) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    handleRedirectAndThemeGeneration(promptData);
  });

  return (
    <div className="relative isolate flex w-full flex-1">
      <div className="@container relative isolate z-1 mx-auto flex max-w-[49rem] flex-1 flex-col justify-center px-4">
        <ChatHeading />

        {/* Chat form input and suggestions */}
        <div className="relative mx-auto flex w-full flex-col">
          <div className="relative isolate z-10 w-full">
            <AIChatForm handleThemeGeneration={handleRedirectAndThemeGeneration} />
          </div>

          {/* Quick suggestions */}
          <HorizontalScrollArea className="mx-auto pt-4 pb-2">
            <SuggestedPillActions handleThemeGeneration={handleRedirectAndThemeGeneration} />
          </HorizontalScrollArea>
        </div>
      </div>
    </div>
  );
}
