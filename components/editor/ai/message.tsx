import Logo from "@/assets/logo.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { type ChatMessage as ChatMessageType } from "@/types/ai";
import { buildAIPromptRender } from "@/utils/ai/ai-prompt";
import ColorPreview from "../theme-preview/color-preview";
import { ChatImagePreview } from "./chat-image-preview";
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

        <div className={cn("group/message relative flex flex-col gap-1", isAssistant && "w-full")}>
          {isUser && message.promptData?.image && (
            <ChatImagePreview imageSrc={message.promptData.image.preview} />
          )}

          <div
            className={cn(
              "w-fit text-sm",
              isUser &&
                "bg-card/75 text-card-foreground/90 border-border/75! self-end rounded-lg border p-3"
            )}
          >
            {getDisplayContent()}
          </div>

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
