"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { useChatContext } from "@/hooks/use-chat-context";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { useGuards } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { usePreferencesStore } from "@/store/preferences-store";
import { AIPromptData } from "@/types/ai";
import { useRouter } from "next/navigation";
import { AIChatForm } from "./ai-chat-form";
import { ChatHeading } from "./chat-heading";
import { SuggestedPillActions } from "./suggested-pill-actions";

export function AIChatHero() {
  const { startNewChat } = useChatContext();
  const { generateThemeCore, isGeneratingTheme, cancelThemeGeneration } =
    useAIThemeGenerationCore();
  const { checkValidSession, checkValidSubscription } = useGuards();
  const router = useRouter();

  const { setChatSuggestionsOpen } = usePreferencesStore();

  const handleRedirectAndThemeGeneration = (promptData: AIPromptData) => {
    if (!checkValidSession("signup", "AI_GENERATE_FROM_PAGE", { promptData })) return;
    if (!checkValidSubscription()) return;

    startNewChat();
    setChatSuggestionsOpen(true);

    router.push("/editor/theme?tab=ai");
    generateThemeCore(promptData);
  };

  usePostLoginAction("AI_GENERATE_FROM_PAGE", ({ promptData }) => {
    handleRedirectAndThemeGeneration(promptData);
  });

  return (
    <div className="relative isolate flex w-full flex-1">
      <div className="@container relative isolate z-1 mx-auto flex max-w-[49rem] flex-1 flex-col justify-center px-4">
        <ChatHeading isGeneratingTheme={isGeneratingTheme} />

        {/* Chat form input and suggestions */}
        <div className="relative mx-auto flex w-full flex-col gap-2">
          <div className="relative isolate z-10 w-full">
            <AIChatForm
              onThemeGeneration={handleRedirectAndThemeGeneration}
              isGeneratingTheme={isGeneratingTheme}
              onCancelThemeGeneration={cancelThemeGeneration}
            />
          </div>

          {/* Quick suggestions */}
          <HorizontalScrollArea className="mx-auto py-2">
            <SuggestedPillActions
              onThemeGeneration={handleRedirectAndThemeGeneration}
              isGeneratingTheme={isGeneratingTheme}
            />
          </HorizontalScrollArea>
        </div>
      </div>
    </div>
  );
}
