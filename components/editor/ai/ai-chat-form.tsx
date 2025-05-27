"use client";

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration, useAIThemeGenerationPrompts } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { JSONContent } from "@tiptap/react";
import { ArrowUp, Loader, Plus, StopCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { LoadingLogo } from "./loading-logo";
import { ThemeStyles } from "@/types/theme";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { useAIChatStore } from "@/store/ai-chat-store";
import { getTextContent } from "@/utils/tiptap-json-content";

const CustomTextarea = dynamic(() => import("@/components/editor/custom-textarea"), {
  ssr: false,
  loading: () => <Loading className="min-h-[60px] w-full rounded-lg" />,
});

export function AIChatForm() {
  const { jsonContent, setJsonContent } = useAIThemeGenerationPrompts();
  const {
    generateTheme,
    loading: aiGenerateLoading,
    cancelThemeGeneration,
  } = useAIThemeGeneration();

  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useAIChatStore();

  const handleThemeGeneration = async (jsonContent: JSONContent | null) => {
    if (!jsonContent) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    addUserMessage({
      content: getTextContent(jsonContent),
    });

    const theme: ThemeStyles = await generateTheme({
      jsonContent,
      onSuccess: () => {},
    });

    addAssistantMessage({
      content: theme ? "Here's the theme I generated for you." : "Failed to generate theme.",
      themeStyles: theme,
    });
  };

  usePostLoginAction("AI_GENERATE_FROM_CHAT", ({ jsonContent }) => {
    handleThemeGeneration(jsonContent);
  });

  const handleContentChange = (jsonContent: JSONContent) => {
    setJsonContent(jsonContent);
  };

  const handleGenerate = async () => {
    if (!session) {
      openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", { jsonContent });
      return;
    }

    await handleThemeGeneration(jsonContent);
  };

  return (
    <div className="@container/form relative transition-all">
      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border shadow-xs">
        <label className="sr-only">Chat Input</label>
        <div className={cn("min-h-[60px] p-2 pb-0", aiGenerateLoading && "pointer-events-none")}>
          <div
            className="bg-muted/40 relative isolate rounded-lg"
            aria-disabled={aiGenerateLoading}
          >
            <AIChatFormGeneratingFallback aiGenerateLoading={aiGenerateLoading} />
            <CustomTextarea
              onContentChange={handleContentChange}
              onGenerate={handleGenerate}
              key={messages.length}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <TooltipWrapper label="Create new chat" asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={aiGenerateLoading || messages.length === 0}
              className="shadow-none"
            >
              <Plus />
              <span>New chat</span>
            </Button>
          </TooltipWrapper>
          <div className="flex items-center gap-2">
            {/* TODO: Add image upload */}
            {aiGenerateLoading ? (
              <TooltipWrapper label="Cancel generation" asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={cancelThemeGeneration}
                  className={cn("flex items-center gap-1 shadow-none", "@max-[350px]/form:w-8")}
                >
                  <StopCircle />
                  <span className="hidden @[350px]/form:inline-flex">Stop</span>
                </Button>
              </TooltipWrapper>
            ) : (
              <TooltipWrapper label="Send message" asChild>
                <Button
                  size="icon"
                  className="size-8 shadow-none"
                  onClick={handleGenerate}
                  disabled={!prompt || aiGenerateLoading}
                >
                  {aiGenerateLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
                </Button>
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIChatFormGeneratingFallback({ aiGenerateLoading }: { aiGenerateLoading: boolean }) {
  return (
    <div
      className={cn(
        "bg-background/50 pointer-events-none absolute inset-0 z-1 flex size-full items-center justify-center opacity-0 backdrop-blur-sm transition-all duration-150 ease-out",
        aiGenerateLoading && "pointer-events-auto opacity-100"
      )}
    >
      <div
        className={cn(
          "text-muted-foreground size-8 scale-0 opacity-0 transition-all duration-150 ease-out md:size-10",
          aiGenerateLoading && "scale-100 opacity-100"
        )}
      >
        <LoadingLogo />
      </div>
    </div>
  );
}
