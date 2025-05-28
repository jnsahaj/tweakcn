"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { ThemeStyles } from "@/types/theme";
import { PROMPTS } from "@/utils/prompts";
import {
  createCurrentThemePromptJson,
  getTextContent,
  mentionsCount,
} from "@/utils/tiptap-json-content";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { AIPillActionButton } from "./ai-pill-action-button";

export function ClosableSuggestedPillActions() {
  const [hasClosedSuggestions, setHasClosedSuggestions] = useState(false);

  const { generateTheme } = useAIThemeGeneration();
  const { openAuthDialog } = useAuthStore();
  const { data: session } = authClient.useSession();
  const { addUserMessage, addAssistantMessage } = useAIChat();

  const handleSetPrompt = async (prompt: string) => {
    const jsonContent = createCurrentThemePromptJson({ prompt });

    if (!session) {
      openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", { jsonContent });
      return;
    }

    addUserMessage({
      content: prompt,
    });

    let transformedJsonContent = jsonContent;

    // If the jsonContent does not have a mention, add the current theme to the jsonContent
    if (mentionsCount(jsonContent) === 0) {
      transformedJsonContent = createCurrentThemePromptJson({
        prompt: getTextContent(jsonContent),
      });
    }

    const theme: ThemeStyles = await generateTheme({ jsonContent: transformedJsonContent });

    addAssistantMessage({
      content: theme ? "Here's the theme I generated for you." : "Failed to generate theme.",
      themeStyles: theme,
    });
  };

  if (hasClosedSuggestions) return null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Fade out effect when scrolling */}
      <div className="via-background/50 from-background pointer-events-none absolute -top-8 right-4 left-0 z-20 h-8 bg-gradient-to-t to-transparent opacity-100 transition-opacity ease-out" />

      <div className="flex w-full items-center justify-between gap-4">
        <h3 className="text-muted-foreground text-xs">Suggestions</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 [&>svg]:size-3"
          onClick={() => setHasClosedSuggestions(true)}
        >
          <X />
        </Button>
      </div>

      <HorizontalScrollArea className="pt-1 pb-2">
        {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
          <AIPillActionButton key={key} onClick={() => handleSetPrompt(prompt)}>
            <Sparkles /> {label}
          </AIPillActionButton>
        ))}
      </HorizontalScrollArea>
    </div>
  );
}
