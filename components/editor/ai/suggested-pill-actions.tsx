"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { ThemeStyles } from "@/types/theme";
import { createCurrentThemePromptJson, PROMPTS } from "@/utils/prompts";
import { Sparkles, X } from "lucide-react";
import { ComponentProps, useState } from "react";

export function ClosableSuggestedPillActions() {
  const [hasClosedSuggestions, setHasClosedSuggestions] = useState(false);

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
        <SuggestedPillActions />
      </HorizontalScrollArea>
    </div>
  );
}

export function SuggestedPillActions() {
  const { generateTheme } = useAIThemeGeneration();
  const { openAuthDialog } = useAuthStore();
  const { data: session } = authClient.useSession();
  const { addUserMessage, addAssistantMessage } = useAIChat();

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

    addUserMessage({
      content: prompt,
      jsonContent: jsonPrompt,
    });

    const theme: ThemeStyles = await generateTheme({
      prompt,
      jsonPrompt: stringifiedJsonPrompt,
      onSuccess: () => {},
    });

    addAssistantMessage({
      content: theme ? "Here's the theme I generated for you." : "Failed to generate theme.", // A generic message for now
      jsonContent: jsonPrompt,
      themeStyles: theme, // Will be used as a checkpoint
    });
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

function PillButton({ className, children, ...props }: PillButtonProps) {
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
        {...props}
        disabled={aiGenerateLoading}
      >
        {children}
      </Button>
    </div>
  );
}
