"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { PROMPTS } from "@/utils/prompts";
import { createCurrentThemePrompt } from "@/utils/ai-prompt";
import { AIPromptData } from "@/types/ai";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { AIPillActionButton } from "./ai-pill-action-button";

export function ClosableSuggestedPillActions({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const [hasClosedSuggestions, setHasClosedSuggestions] = useState(false);
  const { loading: aiIsGenerating } = useAIThemeGeneration();

  const handleSetPrompt = async (prompt: string) => {
    const promptData = createCurrentThemePrompt({ prompt });
    handleThemeGeneration(promptData);
  };

  if (hasClosedSuggestions) return null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Fade out effect when scrolling */}
      <div className="via-background/50 from-background pointer-events-none absolute -top-8 right-0 left-0 z-20 h-8 bg-gradient-to-t to-transparent opacity-100 transition-opacity ease-out" />

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
          <AIPillActionButton
            key={key}
            onClick={() => handleSetPrompt(prompt)}
            disabled={aiIsGenerating}
          >
            <Sparkles /> {label}
          </AIPillActionButton>
        ))}
      </HorizontalScrollArea>
    </div>
  );
}
