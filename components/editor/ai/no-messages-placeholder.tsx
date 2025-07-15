import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt, createPromptDataFromPreset } from "@/utils/ai/ai-prompt";
import { PROMPTS } from "@/utils/ai/prompts";
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
    displayContent: "JavaScript/TypeScript Advent of Code playground",
    prompt:
      "Create a retro JavaScript Advent of Code theme. Use a grayish background with JavaScript yellow and TypeScript blue as primary/secondary colors. Change all fonts to monospace. Make borders sharp.",
  },
  {
    displayContent: "Retro Terminal UI, green phosphor glow",
    prompt:
      "Create a retro terminal theme with black background (dark mode) and grayish background (light mode), use phosphorescent pure green (#22FF22 and shades of it) for text and borders. Use monospace fonts and sharp borders.",
  },
  {
    displayContent: "Monochrome Manga-inspired theme",
    prompt:
      "Create a Manga-inspired theme. Monochromatic palette only (black, off-white, grays), square corners, small contrast solid offset shadows, and high-contrast borders (black on light, off-white on dark). Use a playful font, like Architects daughter.",
  },
  {
    displayContent: "I want a minimal Ghibli Studio vibe",
    prompt:
      "Generate a theme inspired by Studio Ghibli — soft pastels, natural greens, organic colors, and hand-drawn charm.",
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

export function NoMessagesPlaceholder({
  onGenerateTheme,
}: {
  onGenerateTheme: (promptData: AIPromptData | null) => void;
}) {
  const { data: session } = authClient.useSession();
  const { loading: isGenerating } = useAIThemeGeneration();

  const userName = session?.user.name?.split(" ")[0];
  const heading = `What can I help you theme${userName ? `, ${userName}` : ""}?`;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h2 className="text-[clamp(18px,5cqw,28px)] leading-tight font-semibold tracking-tighter text-pretty">
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
                  onGenerateTheme({
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
                  onGenerateTheme(createPromptDataFromPreset(prompt.prompt, prompt.basePreset))
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
                onClick={() => onGenerateTheme(createCurrentThemePrompt({ prompt: prompt.prompt }))}
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
