"use client";

import { toast } from "@/components/ui/use-toast";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getUserMessagesCount, useAIChatStore } from "@/store/ai-chat-store";
import { useAuthStore } from "@/store/auth-store";
import { ThemeStyles } from "@/types/theme";
import {
  createCurrentThemePromptJson,
  getTextContent,
  mentionsCount,
} from "@/utils/tiptap-json-content";
import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { AIChatForm } from "./ai-chat-form";
import { ClosableSuggestedPillActions } from "./closeable-suggested-pill-actions";

const ChatMessages = dynamic(() => import("./chat-messages").then((mod) => mod.ChatMessages), {
  ssr: false,
});

export function AIInterface() {
  const { generateTheme } = useAIThemeGeneration();
  const { messages, addUserMessage, addAssistantMessage } = useAIChatStore();
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  const handleThemeGeneration = async (jsonContent: JSONContent | null) => {
    if (!session) {
      openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", { jsonContent });
      return;
    }

    if (!jsonContent) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    addUserMessage({
      content: getTextContent(jsonContent),
    });

    let transformedJsonContent = jsonContent;

    // if it's not the first message and the jsonContent does not have a mention, add the current theme to the jsonContent
    if (getUserMessagesCount(messages) > 0 && mentionsCount(jsonContent) === 0) {
      transformedJsonContent = createCurrentThemePromptJson({
        prompt: getTextContent(jsonContent),
      });
    }

    const { text, theme } = await generateTheme({
      jsonContent: transformedJsonContent,
    });

    addAssistantMessage({
      content:
        text ?? (theme ? "Here's the theme I generated for you." : "Failed to generate theme."),
      themeStyles: theme,
    });
  };

  usePostLoginAction("AI_GENERATE_FROM_CHAT", ({ jsonContent }) => {
    handleThemeGeneration(jsonContent);
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
