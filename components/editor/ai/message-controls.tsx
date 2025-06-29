import { CopyButton } from "@/components/copy-button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { type ChatMessage as ChatMessageType } from "@/types/ai";
import { ThemeStyles } from "@/types/theme";
import { Goal, RefreshCw } from "lucide-react";

type MessageControlsProps = {
  message: ChatMessageType;
  onRetry: () => void;
};

export function MessageControls({ message, onRetry }: MessageControlsProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const { loading: isAIGenerating } = useAIThemeGeneration();
  const { themeState, setThemeState } = useEditorStore();

  const handleResetThemeToMessageCheckpoint = (themeStyles?: ThemeStyles) => {
    if (!themeStyles) return;

    setThemeState({
      ...themeState,
      styles: themeStyles,
    });
  };

  const getCopyContent = () => {
    if (isUser && message.promptData) {
      return message.promptData.content;
    }
    return message.content || "";
  };

  return (
    <div
      className={cn(
        "mt-2 flex gap-2 opacity-0 transition-opacity duration-300 ease-out group-hover/message:opacity-100",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {isUser && (
        <TooltipWrapper label="Retry this prompt" asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-6 [&>svg]:size-3.5"
            disabled={isAIGenerating}
            onClick={onRetry}
          >
            <RefreshCw />
          </Button>
        </TooltipWrapper>
      )}

      <CopyButton textToCopy={getCopyContent()} />

      {isAssistant && message.themeStyles && (
        <TooltipWrapper label="Reset to this checkpoint" asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-6 [&>svg]:size-3.5"
            disabled={isAIGenerating}
            onClick={() => handleResetThemeToMessageCheckpoint(message.themeStyles)}
          >
            <Goal />
          </Button>
        </TooltipWrapper>
      )}
    </div>
  );
}
