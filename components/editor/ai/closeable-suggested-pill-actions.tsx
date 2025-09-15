"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/store/preferences-store";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt } from "@/utils/ai/ai-prompt";
import { PROMPTS } from "@/utils/ai/prompts";
import { Sparkles, X } from "lucide-react";
import { PillActionButton } from "./pill-action-button";

export function ClosableSuggestedPillActions({
  onGenerateTheme,
  isGeneratingTheme,
}: {
  onGenerateTheme: (promptData: AIPromptData) => void;
  isGeneratingTheme: boolean;
}) {
  const { chatSuggestionsOpen, setChatSuggestionsOpen } = usePreferencesStore();

  const handleSetPrompt = async (prompt: string) => {
    const promptData = createCurrentThemePrompt({ prompt });
    onGenerateTheme(promptData);
  };

  if (!chatSuggestionsOpen) return null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="text-muted-foreground flex w-full items-center justify-between gap-4">
        <h3 className="text-xs">Suggestions</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 [&>svg]:size-3"
          onClick={() => setChatSuggestionsOpen(false)}
        >
          <X />
        </Button>
      </div>

      <HorizontalScrollArea className="pt-1 pb-2">
        {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
          <PillActionButton
            key={key}
            onClick={() => handleSetPrompt(prompt)}
            disabled={isGeneratingTheme}
          >
            <Sparkles /> {label}
          </PillActionButton>
        ))}
      </HorizontalScrollArea>
    </div>
  );
}
