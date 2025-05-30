import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { cn } from "@/lib/utils";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt } from "@/utils/ai-prompt";
import { PROMPTS } from "@/utils/prompts";
import { PaintRoller, Palette } from "lucide-react";
import { ComponentProps, Fragment } from "react";
import TabsTriggerPill from "../theme-preview/tabs-trigger-pill";

interface CreatePrompt {
  displayContent: string;
  prompt: string;
  basePreset: string;
}

interface VariantPrompt {
  displayContent: string;
  prompt: string;
}

const CREATE_PROMPTS: CreatePrompt[] = [
  {
    displayContent: "Make @Twitter but in a slick pink",
    prompt: "Make @Twitter but in a slick pink",
    basePreset: "twitter",
  },
  {
    displayContent: "What if @Supabase was vibrant blue?",
    prompt: "What if @Supabase was vibrant blue?",
    basePreset: "supabase",
  },
  {
    displayContent: "I want a minimal Ghibli Studio vibe",
    prompt: "I want a minimal Ghibli Studio vibe",
    basePreset: "kodama-grove",
  },
];

const VARIANT_PROMPTS: VariantPrompt[] = [
  {
    displayContent: "Make my @Current Theme minimalistic",
    prompt: PROMPTS.minimalStyle.prompt,
  },
  {
    displayContent: "Flatten the colors of my @Current Theme",
    prompt: PROMPTS.flatDesign.prompt,
  },
  {
    displayContent: "Create a brutalist variant of my @Current Theme",
    prompt: PROMPTS.brutalist.prompt,
  },
];

// This can be moved to the ai-prompt utils
const createPromptDataFromPreset = (prompt: string, presetName: string): AIPromptData => {
  const preset = useThemePresetStore.getState().getPreset(presetName);

  if (!preset) {
    throw new Error(`Preset "${presetName}" not found`);
  }

  return {
    content: prompt,
    mentions: [
      {
        id: presetName,
        label: preset.label ?? presetName,
        themeData: {
          light: preset.styles.light || {},
          dark: preset.styles.dark || {},
        },
      },
    ],
  };
};

export function NoMessagesPlaceholder({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const { loading: isGenerating } = useAIThemeGeneration();
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h2 className="text-[clamp(22px,6cqw,32px)] font-semibold tracking-tighter text-pretty">
        What can I help you theme?
      </h2>

      <Tabs defaultValue="create-prompts">
        <TabsList className="m-0 bg-transparent p-0">
          <TabsTriggerPill value="create-prompts" className="flex items-center gap-1">
            <PaintRoller className="size-3.5" aria-hidden="true" />
            Create
          </TabsTriggerPill>
          <TabsTriggerPill value="variant-prompts" className="flex items-center gap-1">
            <Palette className="size-3.5" aria-hidden="true" />
            Variant
          </TabsTriggerPill>
        </TabsList>

        <TabsContent value="create-prompts">
          {CREATE_PROMPTS.map((prompt, index) => (
            <Fragment key={`create-${index}`}>
              <PromptButton
                disabled={isGenerating}
                onClick={() =>
                  handleThemeGeneration(
                    createPromptDataFromPreset(prompt.prompt, prompt.basePreset)
                  )
                }
              >
                {prompt.displayContent}
              </PromptButton>
              {index < CREATE_PROMPTS.length - 1 && <Separator />}
            </Fragment>
          ))}
        </TabsContent>

        <TabsContent value="variant-prompts">
          {VARIANT_PROMPTS.map((prompt, index) => (
            <Fragment key={`variant-${index}`}>
              <PromptButton
                disabled={isGenerating}
                onClick={() =>
                  handleThemeGeneration(createCurrentThemePrompt({ prompt: prompt.prompt }))
                }
              >
                {prompt.displayContent}
              </PromptButton>
              {index < VARIANT_PROMPTS.length - 1 && <Separator />}
            </Fragment>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PromptButtonProps extends ComponentProps<typeof Button> {}

function PromptButton({ className, children, ...props }: PromptButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn("text-muted-foreground w-full justify-start font-normal", className)}
      {...props}
    >
      <span className="truncate">{children}</span>
    </Button>
  );
}
