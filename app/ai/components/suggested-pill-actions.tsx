"use client";

import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { PROMPTS } from "@/utils/prompts";
import { createCurrentThemePrompt } from "@/utils/ai-prompt";
import { AIPromptData } from "@/types/ai";
import { Sparkles } from "lucide-react";
import { AIPillActionButton } from "@/components/editor/ai/ai-pill-action-button";

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
        <AIPillActionButton
          key={key}
          onClick={() => handleSetPrompt(prompt)}
          disabled={aiIsGenerating}
        >
          <Sparkles /> {label}
        </AIPillActionButton>
      ))}
    </>
  );
}
