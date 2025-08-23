import { CopyButton } from "@/components/copy-button";
import { DebugButton } from "@/components/debug-button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ChatMessage } from "@/types/ai";
import { Edit, RefreshCw } from "lucide-react";

type MessageActionsProps = {
  message: ChatMessage;
  onRetry?: () => void;
  onEdit?: () => void;
  isGeneratingTheme: boolean;
  isEditing?: boolean;
};

export function MessageActions({
  message,
  onRetry,
  onEdit,
  isGeneratingTheme,
  isEditing,
}: MessageActionsProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const getCopyContent = () => {
    const convertTextPartsToString = (message: ChatMessage) => {
      return (
        message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("\n") ?? ""
      );
    };

    if (isUser && message.metadata) {
      return message.metadata.promptData?.content ?? convertTextPartsToString(message);
    }

    return convertTextPartsToString(message);
  };

  return (
    <div
      className={cn(
        "invisible flex gap-1 transition-opacity duration-300 ease-out group-hover/message:visible",
        isUser && "justify-end",
        isAssistant && "justify-start pl-7.5"
      )}
    >
      {onRetry && (
        <TooltipWrapper label="Retry" asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 [&>svg]:size-3.5"
            disabled={isGeneratingTheme}
            onClick={onRetry}
          >
            <RefreshCw />
          </Button>
        </TooltipWrapper>
      )}

      {onEdit && isUser && (
        <TooltipWrapper label="Edit" asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 [&>svg]:size-3.5"
            disabled={isGeneratingTheme || isEditing}
            onClick={onEdit}
          >
            <Edit />
          </Button>
        </TooltipWrapper>
      )}

      <CopyButton textToCopy={getCopyContent()} className="size-7 [&>svg]:size-3.5" />

      <DebugButton
        className="size-7 [&>svg]:size-3.5"
        onClick={() => {
          console.log("----- 🐛 Debugging Message -----");
          console.dir(message, { depth: null });
        }}
      />
    </div>
  );
}
