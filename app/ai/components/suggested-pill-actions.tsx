"use client";

import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { PROMPTS } from "@/utils/prompts";
import { createCurrentThemePromptJson } from "@/utils/tiptap-json-content";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

export function SuggestedPillActions() {
  const { generateTheme } = useAIThemeGeneration();
  const { openAuthDialog } = useAuthStore();
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleSetPrompt = async (prompt: string) => {
    const jsonContent = createCurrentThemePromptJson({ prompt });

    if (!session) {
      openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", { jsonContent });
      return;
    }

    generateTheme({ jsonContent });
    router.push("/editor/theme?tab=ai");
  };

  return (
    <>
      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <PillButton key={key} onClick={() => handleSetPrompt(prompt)}>
          <Sparkles /> {label}
        </PillButton>
      ))}
    </>
  );
}

interface PillButtonProps extends ComponentProps<typeof Button> {}

function PillButton({ className, children, disabled, ...props }: PillButtonProps) {
  const { loading: aiGenerateLoading } = useAIThemeGeneration();

  return (
    <div
      className={cn(
        "group/pill relative active:scale-95",
        aiGenerateLoading && "pointer-events-none"
      )}
    >
      <div className="from-primary to-background absolute inset-0 z-[-1] rounded-full bg-gradient-to-br opacity-0 transition-all duration-150 ease-in group-hover/pill:opacity-30" />
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hover:bg-muted/50 text-muted-foreground hover:text-foreground border-border/80! rounded-full border bg-transparent px-2 font-medium text-nowrap whitespace-nowrap backdrop-blur-md transition-all duration-150 ease-in select-none focus:outline-none",
          "group-hover/pill:inset-shadow-primary/50 h-7 inset-shadow-2xs inset-shadow-transparent [&>svg]:size-3",
          className
        )}
        disabled={aiGenerateLoading || disabled}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}
