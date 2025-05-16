"use client";

import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { createCurrentThemePromptJson, PROMPTS } from "@/utils/prompts";
import { Sparkles } from "lucide-react";
import { ComponentProps } from "react";
import { usePreviewPanel } from "../hooks/use-preview-panel";

export function SuggestedPillActions() {
  const { generateTheme } = useAIThemeGeneration();
  const { setIsPreviewPanelOpen } = usePreviewPanel();
  const { openAuthDialog } = useAuthStore();
  const { data: session } = authClient.useSession();

  const handleSetPrompt = async (prompt: string) => {
    const jsonPrompt = createCurrentThemePromptJson({ prompt });
    const stringifiedJsonPrompt = JSON.stringify(jsonPrompt);

    if (!session) {
      openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", {
        prompt,
        jsonPrompt: stringifiedJsonPrompt,
      });
      return;
    }

    await generateTheme({
      prompt,
      jsonPrompt: stringifiedJsonPrompt,
      onSuccess: () => {
        setIsPreviewPanelOpen(true);
      },
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[49rem] flex-wrap items-center justify-center gap-2">
      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <PillButton key={key} onClick={() => handleSetPrompt(prompt)}>
          <Sparkles className="size-3.5" /> {label}
        </PillButton>
      ))}
    </div>
  );
}

interface PillButtonProps extends ComponentProps<typeof Button> {}

function PillButton({ className, children, ...props }: PillButtonProps) {
  const { loading: aiGenerateLoading } = useAIThemeGeneration();

  return (
    <div
      className={cn(
        "group/pill relative active:scale-95",
        aiGenerateLoading && "pointer-events-none"
      )}
    >
      <div className="from-primary to-background absolute inset-0 z-[-1] rounded-full bg-gradient-to-br opacity-0 transition-all duration-150 ease-in group-hover/pill:opacity-50" />
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-full bg-transparent px-2.5 font-medium text-nowrap whitespace-nowrap backdrop-blur-md transition-all duration-150 ease-in select-none focus:outline-none",
          "group-hover/pill:inset-shadow-primary inset-shadow-2xs inset-shadow-transparent",
          className
        )}
        {...props}
        disabled={aiGenerateLoading}
      >
        {children}
      </Button>
    </div>
  );
}
