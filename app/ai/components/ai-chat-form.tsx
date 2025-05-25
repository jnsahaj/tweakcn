"use client";

import ThemePresetSelect from "@/components/editor/theme-preset-select";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration, useAIThemeGenerationPrompts } from "@/hooks/use-ai-theme-generation";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { JSONContent } from "@tiptap/react";
import { ArrowUp, Loader, StopCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  const handleThemeGenerationAndRedirect = (jsonContent: JSONContent) => {
    generateTheme({ jsonContent });
    router.push("/editor/theme?tab=ai");
  };

  usePostLoginAction("AI_GENERATE_FROM_CHAT", ({ jsonContent }) => {
    if (!jsonContent) {
      toast({
        title: "Error",
        description: "Failed to generate theme. Please try again.",
      });
      return;
    }

    handleThemeGenerationAndRedirect(jsonContent);
  });

  const handleContentChange = (content: JSONContent) => {
    setJsonContent(content);
  };

  const handleGenerate = async () => {
    if (!session) {
      if (jsonContent) {
        openAuthDialog("signup", "AI_GENERATE_FROM_CHAT", { jsonContent });
      }
      return;
    }

    if (jsonContent) {
      handleThemeGenerationAndRedirect(jsonContent);
    }
  };

  return (
    <div className="@container/form relative transition-all">
      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col overflow-hidden rounded-lg border shadow-xs">
        <label className="sr-only">Chat Input</label>
        <div className={cn("min-h-[60px] p-2 pb-0", aiGenerateLoading && "pointer-events-none")}>
          <div
            className="bg-muted/40 relative isolate rounded-lg"
            aria-disabled={aiGenerateLoading}
          >
            <CustomTextarea onContentChange={handleContentChange} onGenerate={handleGenerate} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex w-full max-w-68 items-center gap-2 overflow-hidden">
            <ThemePresetSelect disabled={aiGenerateLoading} withCycleThemes={false} />
          </div>

          <div className="flex items-center gap-2">
            {aiGenerateLoading ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={cancelThemeGeneration}
                className={cn("flex items-center gap-1", "@max-[350px]/form:w-8")}
              >
                <StopCircle />
                <span className="hidden @[350px]/form:inline-flex">Stop</span>
              </Button>
            ) : (
              <Button
                size="icon"
                className="size-8"
                onClick={handleGenerate}
                disabled={!jsonContent || aiGenerateLoading}
              >
                {aiGenerateLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
