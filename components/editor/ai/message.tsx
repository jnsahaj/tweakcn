import Logo from "@/assets/logo.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { AIPromptData, type ChatMessage } from "@/types/ai";
import { buildAIPromptRender } from "@/utils/ai/ai-prompt";
import ColorPreview from "../theme-preview/color-preview";
import { ChatImagePreview } from "./chat-image-preview";
import { ChatThemePreview } from "./chat-theme-preview";
import { LoadingLogo } from "./loading-logo";
import { MessageActions } from "./message-actions";
import { MessageEditForm } from "./message-edit-form";
import { StreamText } from "./stream-text";

type MessageProps = {
  message: ChatMessage;
  onRetry: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
  isLastMessageStreaming: boolean;
  isGeneratingTheme: boolean;
};

export default function Message({
  message,
  onRetry,
  isEditing,
  onEdit,
  onEditSubmit,
  onEditCancel,
  isLastMessageStreaming,
  isGeneratingTheme,
}: MessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const showMessageActions = !isLastMessageStreaming;

  return (
    <div className={cn("flex w-full items-start gap-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex w-full max-w-[90%] items-start")}>
        <div
          className={cn(
            "group/message relative flex w-full flex-col gap-2 wrap-anywhere whitespace-pre-wrap"
          )}
        >
          {isUser && (
            <UserMessage
              message={message}
              isEditing={isEditing}
              onRetry={onRetry}
              onEdit={onEdit}
              onEditSubmit={onEditSubmit}
              onEditCancel={onEditCancel}
              isGeneratingTheme={isGeneratingTheme}
            />
          )}

          {isAssistant && (
            <AssistantMessage message={message} isLastMessageStreaming={isLastMessageStreaming} />
          )}

          {showMessageActions && (
            <MessageActions
              message={message}
              onRetry={onRetry}
              onEdit={onEdit}
              isEditing={isEditing}
              isGeneratingTheme={isGeneratingTheme}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface AssistantMessageProps {
  message: ChatMessage;
  isLastMessageStreaming: boolean;
}

function AssistantMessage({ message, isLastMessageStreaming }: AssistantMessageProps) {
  const { themeState } = useEditorStore();

  return (
    <div className="flex items-start gap-1.5">
      {isLastMessageStreaming ? (
        <div className="relative flex size-6 shrink-0 items-center justify-center">
          <LoadingLogo />
        </div>
      ) : (
        <div
          className={cn(
            "border-border/50! bg-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full border select-none"
          )}
        >
          <Logo className={cn("text-background size-full p-0.5")} />
        </div>
      )}

      <div className="relative flex w-full flex-col gap-3">
        {message.parts.map((part, idx) => {
          const { type } = part;
          const key = `message-${message.id}-part-${idx}`;

          if (type === "text") {
            return (
              <StreamText
                key={key}
                text={part.text}
                className="w-fit text-sm"
                animate={isLastMessageStreaming}
                markdown
              />
            );
          }

          if (type === "tool-generateTheme") {
            const { state } = part;

            if (state === "output-available") {
              const themeStyles = part.output;
              return (
                <ChatThemePreview
                  key={key}
                  status="complete"
                  themeStyles={themeStyles}
                  className="p-0"
                >
                  <ScrollArea className="h-48">
                    <div className="p-2">
                      <ColorPreview styles={themeStyles} currentMode={themeState.currentMode} />
                    </div>
                  </ScrollArea>
                </ChatThemePreview>
              );
            }

            if (state === "output-error") {
              return <ChatThemePreview key={key} status="error" className="p-0" />;
            }

            return <ChatThemePreview key={key} status="loading" className="p-0" />;
          }
        })}
      </div>
    </div>
  );
}

interface UserMessageProps {
  message: ChatMessage;
  isEditing: boolean;
  onRetry: () => void;
  onEdit: () => void;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
  isGeneratingTheme: boolean;
}

function UserMessage({
  message,
  isEditing,
  onEditSubmit,
  onEditCancel,
  isGeneratingTheme,
}: UserMessageProps) {
  const promptData = message.metadata?.promptData;
  const shouldDisplayMsgContent = promptData?.content?.trim() != "";

  const getDisplayContent = () => {
    if (promptData) {
      return buildAIPromptRender(promptData);
    }

    return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
  };

  const msgContent = getDisplayContent();

  const getImagesToDisplay = () => {
    const images = promptData?.images ?? [];

    if (images.length === 1) {
      return (
        <div className="self-end">
          <ChatImagePreview src={images[0].url} alt="Image preview" />
        </div>
      );
    } else if (images.length > 1) {
      return (
        <div className="flex flex-row items-center justify-end gap-1 self-end">
          {images.map((image, idx) => (
            <div key={idx} className="aspect-square size-full max-w-32 flex-1">
              <ChatImagePreview
                className="size-full object-cover"
                src={image.url}
                alt="Image preview"
              />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const msgImages = getImagesToDisplay();

  if (isEditing) {
    return (
      <MessageEditForm
        key={message.id}
        message={message}
        onEditSubmit={onEditSubmit}
        onEditCancel={onEditCancel}
        disabled={isGeneratingTheme}
      />
    );
  }

  return (
    <div className="relative flex flex-col gap-1">
      {msgImages}

      {shouldDisplayMsgContent && (
        <div
          className={cn(
            "bg-card/75 text-card-foreground/90 w-fit self-end rounded-lg border p-3 text-sm"
          )}
        >
          {msgContent}
        </div>
      )}
    </div>
  );
}
