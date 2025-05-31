import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt } from "@/utils/ai-prompt";
import { PROMPTS } from "@/utils/prompts";
import { Blend, PaintRoller, WandSparkles } from "lucide-react";
import { ComponentProps, Fragment } from "react";
import TabsTriggerPill from "../theme-preview/tabs-trigger-pill";

interface RemixPrompt {
  displayContent: string;
  prompt: string;
  basePreset: string;
}

interface Prompt {
  displayContent: string;
  prompt: string;
}

const CREATE_PROMPTS: Prompt[] = [
  {
    displayContent: "Magazine layout, bold and clean",
    prompt:
      "Design a high-contrast editorial layout with bold type, strict grids, and print-inspired accents — like a modern digital magazine.",
  },
  {
    displayContent: "I want a minimal Ghibli Studio vibe",
    prompt:
      "Generate a theme inspired by Studio Ghibli — soft pastels, natural greens, organic colors, and hand-drawn charm.",
  },
  {
    displayContent: "Retro Terminal UI, green phosphor glow",
    prompt:
      "Create a retro terminal theme with black background (in dark mode), phosphorescent green primary and text,  and monospace font.",
  },
];

const REMIX_PROMPTS: RemixPrompt[] = [
  {
    displayContent: "Make @Twitter but in a slick purple",
    prompt: "Make @Twitter but in a slick purple",
    basePreset: "twitter",
  },
  {
    displayContent: "What if @Supabase was vibrant blue?",
    prompt: "Make @Supabase but in vibrant blue",
    basePreset: "supabase",
  },
  {
    displayContent: "I want @Doom 64 with muted colors",
    prompt: "I want @Doom 64 with alternate colors",
    basePreset: "doom-64",
  },
];

const VARIANT_PROMPTS: Prompt[] = [
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
  const { data: session } = authClient.useSession();
  const { loading: isGenerating } = useAIThemeGeneration();

  const userName = session?.user.name?.split(" ")[0];
  const heading = `What can I help you theme${userName ? `, ${userName}` : ""}?`;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h2 className="text-[clamp(22px,6cqw,32px)] font-semibold tracking-tighter text-pretty">
        {heading}
      </h2>

      <Tabs defaultValue="create-prompts">
        <HorizontalScrollArea className="mb-1">
          <TabsList className="m-0 bg-transparent p-0">
            <TabsTriggerPill value="create-prompts" className="flex items-center gap-1">
              <PaintRoller className="size-3.5" aria-hidden="true" />
              Create
            </TabsTriggerPill>
            <TabsTriggerPill value="variant-prompts" className="flex items-center gap-1">
              <Blend className="size-3.5" aria-hidden="true" />
              Remix
            </TabsTriggerPill>
            <TabsTriggerPill value="tweak-prompts" className="flex items-center gap-1">
              <WandSparkles className="size-3.5" aria-hidden="true" />
              Tweak
            </TabsTriggerPill>
          </TabsList>
        </HorizontalScrollArea>

        <TabsContent value="create-prompts">
          {CREATE_PROMPTS.map((prompt, index) => (
            <Fragment key={`create-${index}`}>
              <PromptButton
                disabled={isGenerating}
                onClick={() =>
                  handleThemeGeneration({
                    content: prompt.prompt,
                    mentions: [],
                  })
                }
              >
                {prompt.displayContent}
              </PromptButton>
              {index < CREATE_PROMPTS.length - 1 && <Separator className="bg-border/50" />}
            </Fragment>
          ))}
        </TabsContent>

        <TabsContent value="variant-prompts">
          {REMIX_PROMPTS.map((prompt, index) => (
            <Fragment key={`variant-${index}`}>
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
              {index < REMIX_PROMPTS.length - 1 && <Separator className="bg-border/50" />}
            </Fragment>
          ))}
        </TabsContent>

        <TabsContent value="tweak-prompts">
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
              {index < VARIANT_PROMPTS.length - 1 && <Separator className="bg-border/50" />}
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
