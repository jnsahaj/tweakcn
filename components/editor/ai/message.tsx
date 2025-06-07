import Logo from "@/assets/logo.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { type ChatMessage as ChatMessageType } from "@/types/ai";
import { buildAIPromptRender } from "@/utils/ai/ai-prompt";
import ColorPreview from "../theme-preview/color-preview";
import { ChatThemePreview } from "./chat-theme-preview";
import { MessageControls } from "./message-controls";

type MessageProps = {
  message: ChatMessageType;
  onRetry: () => void;
};

export default function Message({ message, onRetry }: MessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const { themeState } = useEditorStore();

  const getDisplayContent = () => {
    if (isUser && message.promptData) {
      return buildAIPromptRender(message.promptData);
    }
    return message.content || "";
  };

  return (
    <div className={cn("flex items-start gap-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn("flex w-full max-w-[90%] items-start gap-1.5", isUser && "flex-row-reverse")}
      >
        {isAssistant && (
          <div className="border-border/50! bg-foreground relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border select-none">
            <Logo className="text-background size-full p-0.5" />
          </div>
        )}

        <div className={cn("group/message relative", isAssistant && "w-full")}>
          <p
            className={cn(
              "bg-red w-fit text-sm",
              isUser && "bg-muted/80 text-foreground/80 border-border/50! rounded-lg border p-4"
            )}
          >
            {getDisplayContent()}
          </p>

          {isAssistant && message.themeStyles && (
            <div className="mt-2">
              <ChatThemePreview themeStyles={message.themeStyles} className="p-0">
                <ScrollArea className="h-48">
                  <div className="p-2">
                    <ColorPreview
                      styles={message.themeStyles}
                      currentMode={themeState.currentMode}
                    />
                  </div>
                </ScrollArea>
              </ChatThemePreview>
            </div>
          )}

          <MessageControls message={message} onRetry={onRetry} />
        </div>
      </div>
    </div>
  );
}
