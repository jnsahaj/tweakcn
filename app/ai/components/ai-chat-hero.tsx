"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { useAIGenerateTheme } from "@/hooks/use-ai-generate-theme";
import { useGuards } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { useAIChatStore } from "@/store/ai-chat-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { AIPromptData } from "@/types/ai";
import { useRouter } from "next/navigation";
import { AIChatForm } from "./ai-chat-form";
import { ChatHeading } from "./chat-heading";
import { SuggestedPillActions } from "./suggested-pill-actions";

export function AIChatHero() {
  const { generateTheme } = useAIGenerateTheme();
  const { checkValidSession, checkValidSubscription } = useGuards();
  const router = useRouter();

  const { clearMessages } = useAIChatStore();
  const { setChatSuggestionsOpen } = usePreferencesStore();

  const handleRedirectAndThemeGeneration = async (promptData: AIPromptData | null) => {
    if (!checkValidSession("signup", "AI_GENERATE_FROM_PAGE", { promptData })) return;
    if (!checkValidSubscription()) return;

    // Clear the messages and open the chat suggestions when the user starts a chat from the '/ai' page
    clearMessages();
    setChatSuggestionsOpen(true);

    router.push("/editor/theme?tab=ai");
    generateTheme(promptData);
  };

  usePostLoginAction("AI_GENERATE_FROM_PAGE", ({ promptData }) => {
    handleRedirectAndThemeGeneration(promptData);
  });

  return (
    <div className="relative isolate flex w-full flex-1">
      <div className="@container relative isolate z-1 mx-auto flex max-w-[49rem] flex-1 flex-col justify-center px-4">
        <ChatHeading />

        {/* Chat form input and suggestions */}
        <div className="relative mx-auto flex w-full flex-col gap-2">
          <div className="relative isolate z-10 w-full">
            <AIChatForm handleThemeGeneration={handleRedirectAndThemeGeneration} />
          </div>

          {/* Quick suggestions */}
          <HorizontalScrollArea className="mx-auto py-2">
            <SuggestedPillActions handleThemeGeneration={handleRedirectAndThemeGeneration} />
          </HorizontalScrollArea>
        </div>
      </div>
    </div>
  );
}
