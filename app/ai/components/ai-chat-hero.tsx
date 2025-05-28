"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { useAIChatStore } from "@/store/ai-chat-store";
import { useAuthStore } from "@/store/auth-store";
import {
  createCurrentThemePromptJson,
  getTextContent,
  mentionsCount,
} from "@/utils/tiptap-json-content";
import { JSONContent } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { AIChatForm } from "./ai-chat-form";
import { ChatHeading } from "./chat-heading";
import { SuggestedPillActions } from "./suggested-pill-actions";
import { buildPrompt } from "@/lib/ai-theme-generator";

export function AIChatHero() {
  const { addUserMessage, addAssistantMessage, clearMessages } = useAIChatStore();
  const router = useRouter();
  const { generateTheme } = useAIThemeGeneration();
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  const handleRedirectAndThemeGeneration = async (jsonContent: JSONContent | null) => {
    if (!session) {
      if (jsonContent) {
        openAuthDialog("signup", "AI_GENERATE_FROM_PAGE", { jsonContent });
      }
      return;
    }

    if (!jsonContent) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    // Clear the messages when the user starts a chat from the '/ai' page
    clearMessages();

    addUserMessage({
      content: getTextContent(jsonContent),
    });

    router.push("/editor/theme?tab=ai");

    let transformedJsonContent = jsonContent;

    // If the jsonContent does not have a mention, add the current theme to the jsonContent
    if (mentionsCount(jsonContent) === 0) {
      transformedJsonContent = createCurrentThemePromptJson({
        prompt: getTextContent(jsonContent),
      });
    }

    const result = await generateTheme(buildPrompt(transformedJsonContent));

    if (!result) {
      addAssistantMessage({
        content: "Failed to generate theme.",
      });
    }

    addAssistantMessage({
      content:
        result?.text ??
        (result?.theme ? "Here's the theme I generated for you." : "Failed to generate theme."),
      themeStyles: result?.theme,
    });
  };

  usePostLoginAction("AI_GENERATE_FROM_PAGE", ({ jsonContent }) => {
    if (!jsonContent) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    handleRedirectAndThemeGeneration(jsonContent);
  });

  return (
    <div className="relative isolate flex w-full flex-1 overflow-hidden">
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
