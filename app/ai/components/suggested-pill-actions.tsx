"use client";

import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { PROMPTS } from "@/utils/ai/prompts";
import { createCurrentThemePrompt } from "@/utils/ai/ai-prompt";
import { AIPromptData } from "@/types/ai";
import { Sparkles } from "lucide-react";
import { PillActionButton } from "@/components/editor/ai/pill-action-button";

export function SuggestedPillActions({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const { loading: aiIsGenerating } = useAIThemeGeneration();

  const handleSetPrompt = async (prompt: string) => {
    const promptData = createCurrentThemePrompt({ prompt });
    handleThemeGeneration(promptData);
  };

  return (
    <>
      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <PillActionButton
          key={key}
          onClick={() => handleSetPrompt(prompt)}
          disabled={aiIsGenerating}
        >
          <Sparkles /> {label}
        </PillActionButton>
      ))}
    </>
  );
}
