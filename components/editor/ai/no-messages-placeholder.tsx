import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt, createPromptDataFromPreset } from "@/utils/ai/ai-prompt";
import { CREATE_PROMPTS, REMIX_PROMPTS, VARIANT_PROMPTS } from "@/utils/ai/prompts";
import { Blend, PaintRoller, WandSparkles } from "lucide-react";
import { ComponentProps, Fragment } from "react";
import TabsTriggerPill from "../theme-preview/tabs-trigger-pill";

export function NoMessagesPlaceholder({
  onGenerateTheme,
}: {
  onGenerateTheme: (promptData: AIPromptData | null) => void;
}) {
  const { data: session } = authClient.useSession();
  const { loading: isGenerating } = useAIThemeGenerationCore();

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
