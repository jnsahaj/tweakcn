import { CopyButton } from "@/components/copy-button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { type ChatMessage as ChatMessageType } from "@/types/ai";
import { ThemeStyles } from "@/types/theme";
import { mergeThemeStylesWithDefaults } from "@/utils/theme-styles";
import { Edit, History, RefreshCw } from "lucide-react";

type MessageControlsProps = {
  message: ChatMessageType;
  onRetry?: () => void;
  onEdit?: () => void;
  isEditing?: boolean;
};

export function MessageControls({ message, onRetry, onEdit, isEditing }: MessageControlsProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const { loading: isAIGenerating } = useAIThemeGeneration();
  const { themeState, setThemeState } = useEditorStore();

  const handleResetThemeToMessageCheckpoint = (themeStyles?: ThemeStyles) => {
    if (!themeStyles) return;

    setThemeState({
      ...themeState,
      styles: mergeThemeStylesWithDefaults(themeStyles),
    });
  };

  const getCopyContent = () => {
    if (isUser && message.promptData) {
      return message.promptData.content;
    }
    return message.content || "";
  };

  if (isUser) {
    return (
      <div
        className={cn(
          "flex gap-2 opacity-0 transition-opacity duration-300 ease-out group-hover/message:opacity-100",
          "justify-end"
        )}
      >
        {onRetry && (
          <TooltipWrapper label="Retry" asChild>
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

        {onEdit && (
          <TooltipWrapper label="Edit" asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-6 [&>svg]:size-3.5"
              disabled={isAIGenerating || isEditing}
              onClick={onEdit}
            >
              <Edit />
            </Button>
          </TooltipWrapper>
        )}

        <CopyButton textToCopy={getCopyContent()} />
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div
        className={cn(
          "flex gap-2 opacity-0 transition-opacity duration-300 ease-out group-hover/message:opacity-100",
          "justify-start"
        )}
      >
        <CopyButton textToCopy={getCopyContent()} />

        {message.themeStyles && (
          <TooltipWrapper label="Restore checkpoint" asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-6 [&>svg]:size-3.5"
              disabled={isAIGenerating}
              onClick={() => handleResetThemeToMessageCheckpoint(message.themeStyles)}
            >
              <History />
            </Button>
          </TooltipWrapper>
        )}
      </div>
    );
  }
}
