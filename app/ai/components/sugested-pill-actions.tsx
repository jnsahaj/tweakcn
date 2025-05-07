"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { ComponentProps } from "react";

// TODO: Define how to implement this feature since the useAIThemeGeneration hook
// expects a prompt and jsonPrompt (specific editor format) as parameters.
// - Each Button should apply the prompt directly, it should not update the TextArea
// since the user may want to keep the original prompt.
// - Apparently the JSON prompt is required to use @Current Theme mentions.

const PROMPTS = {
  flatDesign: {
    label: "Flat Design",
    prompt:
      "I want a flat design. Use the @Current Theme and make the 'background', 'card', 'popover', and 'sidebar' tokens use the same color value. Remove shadows completely, for example by setting 'shadow-opacity' to '0%' or 'shadow-blur' and 'shadow-spread' to '0px'. Default 'border' styles are okay.",
  },
  minimalStyle: {
    label: "Minimal Style",
    prompt:
      "I want a minimal style. Use the @Current Theme and make it minimalist. This means simplifying the color palette, possibly using more muted tones. Reduce or remove 'border' and shadows, or make them very subtle. Focus on clean typography and generous 'spacing' and 'letter-spacing'.",
  },
  brutalist: {
    label: "Make it Brutalist",
    prompt:
      "Make it brutalist style. Use the @Current Theme and set 'radius' to '0px'. The 'border' color should strongly contrast with the 'background' color. For shadows, use a 'shadow-color' that also contrasts sharply with the 'background', set 'shadow-blur' to '0px', 'shadow-opacity' to '100%', and use 'shadow-offset-x', 'shadow-offset-y', and 'shadow-spread' to create a hard, offset shadow effect.",
  },
  highContrast: {
    label: "High Contrast Mode",
    prompt:
      "Use the @Current Theme and enhance the theme for high contrast. Maximize the contrast between all foreground and background pairs (e.g., 'foreground' vs 'background', 'primary-foreground' vs 'primary', 'card-foreground' vs 'card'). This is especially important for 'muted-foreground' and 'input' text against their backgrounds.",
  },
};

export function SuggestedPillActions({ setPrompt }: { setPrompt: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[49rem] items-center justify-center gap-4">
      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <PillButton key={key} onClick={() => setPrompt(prompt)}>
          <Sparkles className="size-3.5" /> {label}
        </PillButton>
      ))}
    </div>
  );
}

interface PillButtonProps extends ComponentProps<typeof Button> {}

function PillButton({ className, children, ...props }: PillButtonProps) {
  return (
    <div className="group/pill relative">
      <div className="from-primary to-background absolute inset-0 z-[-1] rounded-full bg-gradient-to-br opacity-0 transition-all duration-150 ease-in group-hover/pill:opacity-50" />
      <Button
        variant="outline"
        className={cn(
          "hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-full bg-transparent px-2.5 text-sm font-medium text-nowrap whitespace-nowrap backdrop-blur-md transition-all duration-150 ease-in select-none focus:outline-none",
          "group-hover/pill:inset-shadow-primary inset-shadow-2xs inset-shadow-transparent",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}
