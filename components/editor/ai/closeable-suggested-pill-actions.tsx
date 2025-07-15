"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { usePreferencesStore } from "@/store/preferences-store";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt } from "@/utils/ai/ai-prompt";
import { PROMPTS } from "@/utils/ai/prompts";
import { Sparkles, X } from "lucide-react";
import { PillActionButton } from "./pill-action-button";

export function ClosableSuggestedPillActions({
  onGenerateTheme,
}: {
  onGenerateTheme: (promptData: AIPromptData | null) => Promise<void>;
}) {
  const { loading: aiIsGenerating } = useAIThemeGeneration();
  const { chatSuggestionsOpen, setChatSuggestionsOpen } = usePreferencesStore();

  const handleSetPrompt = async (prompt: string) => {
    const promptData = createCurrentThemePrompt({ prompt });
    onGenerateTheme(promptData);
  };

  if (!chatSuggestionsOpen) return null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Fade out effect when scrolling */}
      <div className="via-background/50 from-background pointer-events-none absolute -top-8 right-0 left-0 z-20 h-8 bg-gradient-to-t to-transparent opacity-100 transition-opacity ease-out" />

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
            disabled={aiIsGenerating}
          >
            <Sparkles /> {label}
          </PillActionButton>
        ))}
      </HorizontalScrollArea>
    </div>
  );
}
