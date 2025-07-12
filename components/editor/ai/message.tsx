import Logo from "@/assets/logo.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { AIPromptData, type ChatMessage as ChatMessageType } from "@/types/ai";
import { buildAIPromptRender } from "@/utils/ai/ai-prompt";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import ColorPreview from "../theme-preview/color-preview";
import { ChatImagePreview } from "./chat-image-preview";
import { ChatThemePreview } from "./chat-theme-preview";
import { MessageControls } from "./message-controls";
import { MessageEditForm } from "./message-edit-form";

type MessageProps = {
  message: ChatMessageType;
  onRetry: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
};

export default function Message({
  message,
  onRetry,
  isEditing,
  onEdit,
  onEditSubmit,
  onEditCancel,
}: MessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("flex w-full items-start gap-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex w-full max-w-[90%] items-start")} ref={parentRef}>
        <div className={cn("group/message relative flex w-full flex-col gap-2 overflow-hidden")}>
          {isUser && (
            <UserMessage
              message={message}
              isEditing={isEditing}
              parentRef={parentRef}
              onEditSubmit={onEditSubmit}
              onEditCancel={onEditCancel}
            />
          )}

          {isAssistant && <AssistantMessage message={message} />}

          <MessageControls
            message={message}
            onRetry={onRetry}
            onEdit={onEdit}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
}

interface AssistantMessageProps {
  message: ChatMessageType;
}

function AssistantMessage({ message }: AssistantMessageProps) {
  const { themeState } = useEditorStore();
  const msgContent = message.content || "";

  return (
    <div className="flex items-start gap-1.5">
      <div className="border-border/50! bg-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full border select-none">
        <Logo className="text-background size-full p-0.5" />
      </div>
      <div className="relative flex flex-col gap-2">
        <div className="w-fit text-sm">{msgContent}</div>

        {message.themeStyles && (
          <ChatThemePreview themeStyles={message.themeStyles} className="p-0">
            <ScrollArea className="h-48">
              <div className="p-2">
                <ColorPreview styles={message.themeStyles} currentMode={themeState.currentMode} />
              </div>
            </ScrollArea>
          </ChatThemePreview>
        )}
      </div>
    </div>
  );
}

interface UserMessageProps {
  message: ChatMessageType;
  isEditing: boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
}

function UserMessage({
  message,
  isEditing,
  parentRef,
  onEditSubmit,
  onEditCancel,
}: UserMessageProps) {
  const [messageWidth, setMessageWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!isEditing) return;

    function updateWidth() {
      if (parentRef.current) setMessageWidth(parentRef.current.offsetWidth);
    }
    updateWidth();
    // Track the parent element width changes
    const observer = new window.ResizeObserver(updateWidth);
    if (parentRef.current) observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, [isEditing, parentRef]);

  const shouldDisplayMsgContent = message.promptData?.content?.trim() != "";

  const getDisplayContent = useCallback(() => {
    if (message.promptData) {
      return buildAIPromptRender(message.promptData);
    }

    return message.content || "";
  }, [message.promptData, message.content]);

  const msgContent = getDisplayContent();

  const getImagesToDisplay = useCallback(() => {
    const images = message.promptData?.images ?? [];

    if (images.length === 1) {
      return (
        <div className="self-end overflow-hidden rounded-lg">
          <ChatImagePreview src={images[0].url} alt="Image preview" />
        </div>
      );
    } else if (images.length > 1) {
      return (
        <div className="flex flex-row items-center justify-end gap-1 self-end">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="aspect-square size-full max-w-32 flex-1 overflow-hidden rounded-lg"
            >
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
  }, [message.promptData?.images]);

  const msgImages = getImagesToDisplay();

  if (isEditing) {
    return (
      <div style={messageWidth ? { width: messageWidth } : undefined}>
        <MessageEditForm
          key={message.id}
          message={message}
          onEditSubmit={onEditSubmit}
          onEditCancel={onEditCancel}
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-1">
      {msgImages}

      {shouldDisplayMsgContent && (
        <div
          className={cn(
            "bg-card/75 text-card-foreground/90 border-border/75! w-fit self-end rounded-lg border p-3 text-sm"
          )}
        >
          {msgContent}
        </div>
      )}
    </div>
  );
}
