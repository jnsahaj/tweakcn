"use client";

import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { cn } from "@/lib/utils";
import { PROMPTS } from "@/utils/prompts";
import { createCurrentThemePromptJson } from "@/utils/tiptap-json-content";
import { JSONContent } from "@tiptap/react";
import { Sparkles } from "lucide-react";
import { ComponentProps } from "react";

export function SuggestedPillActions({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (jsonContent: JSONContent | null) => void;
}) {
  const { loading: aiGenerateLoading } = useAIThemeGeneration();

  const handleGenerate = async (prompt: string) => {
    const jsonContent = createCurrentThemePromptJson({ prompt });
    handleThemeGeneration(jsonContent);
  };

  return (
    <>
      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <PillButton key={key} onClick={() => handleGenerate(prompt)} disabled={aiGenerateLoading}>
          <Sparkles /> {label}
        </PillButton>
      ))}
    </>
  );
}

interface PillButtonProps extends ComponentProps<typeof Button> {}

function PillButton({ className, children, disabled, ...props }: PillButtonProps) {
  return (
    <div className={cn("group/pill relative active:scale-95", disabled && "pointer-events-none")}>
      <div className="from-primary to-background absolute inset-0 z-[-1] rounded-full bg-gradient-to-br opacity-0 transition-all duration-150 ease-in group-hover/pill:opacity-30" />
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hover:bg-muted/50 text-muted-foreground hover:text-foreground border-border/80! rounded-full border bg-transparent px-2 font-medium text-nowrap whitespace-nowrap backdrop-blur-md transition-all duration-150 ease-in select-none focus:outline-none",
          "group-hover/pill:inset-shadow-primary/50 h-7 inset-shadow-2xs inset-shadow-transparent [&>svg]:size-3",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}
