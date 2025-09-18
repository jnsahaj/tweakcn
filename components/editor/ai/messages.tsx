import Logo from "@/assets/logo.svg";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/loader";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/hooks/use-chat-context";
import { useScrollStartEnd } from "@/hooks/use-scroll-start-end";
import { cn } from "@/lib/utils";
import { AIPromptData, type ChatMessage } from "@/types/ai";
import {
  filterMessagesToDisplay,
  getLastAssistantMessage,
  getUserMessages,
} from "@/utils/ai/messages";
import { parseAiSdkTransportError } from "@/lib/ai/parse-ai-sdk-transport-error";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { LoadingLogo } from "./loading-logo";
import Message from "./message";

type ChatMessagesProps = {
  messages: ChatMessage[];
  onRetry: (messageIndex: number) => void;
  onEdit: (messageIndex: number) => void;
  onEditSubmit: (messageIndex: number, newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
  editingMessageIndex?: number | null;
  isGeneratingTheme: boolean;
};

export function Messages({
  messages,
  onRetry,
  onEdit,
  onEditSubmit,
  onEditCancel,
  editingMessageIndex,
  isGeneratingTheme,
}: ChatMessagesProps) {
  const { status, error, clearError } = useChatContext();
  const { isScrollStart, isScrollEnd, scrollStartRef, scrollEndRef } = useScrollStartEnd();

  const previousUserMsgLength = useRef<number>(
    messages.filter((message) => message.role === "user").length
  );

  // Scroll to the bottom of the conversation when a new user message is added
  useEffect(() => {
    const scrollEndElement = scrollEndRef.current;
    if (!scrollEndElement) return;

    const currentUserMsgCount = getUserMessages(messages).length;
    const didUserMsgCountChange = previousUserMsgLength.current !== currentUserMsgCount;

    if (!didUserMsgCountChange && status === "streaming") return;

    previousUserMsgLength.current = currentUserMsgCount;
    requestAnimationFrame(() => {
      console.log("scrolling to end");
      scrollEndElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [messages, status]);

  const visibleMessages = useMemo(() => filterMessagesToDisplay(messages), [messages]);

  const showLoadingMessage = useMemo(() => {
    const isSubmitted = status === "submitted";
    const isStreaming = status === "streaming";
    const isError = status === "error";
    const lastAssistantMsgHasText = getLastAssistantMessage(messages)?.parts.some(
      (part) => part.type === "text" && Boolean(part.text)
    );

    return !isError && (isSubmitted || (isStreaming && !lastAssistantMsgHasText));
  }, [status, messages]);

  const errorText = useMemo(() => {
    if (!error) return undefined;
    const defaultMessage = "Failed to generate theme. Please try again.";
    const normalized = parseAiSdkTransportError(error, defaultMessage);
    return normalized.message ?? defaultMessage;
  }, [error]);

  return (
    <div className="relative size-full">
      {/* Top fade out effect when scrolling */}
      <div
        className={cn(
          "via-background/50 from-background pointer-events-none absolute top-0 right-0 left-0 z-20 h-6 bg-gradient-to-b to-transparent opacity-100 transition-opacity ease-out",
          isScrollStart ? "opacity-0" : "opacity-100"
        )}
      />

      <Conversation className="[&>div]:scrollbar-thin relative size-full overflow-hidden">
        <ConversationContent className="relative flex w-full flex-col p-4">
          <div ref={scrollStartRef} />
          <div className="flex flex-col gap-8 pb-8 wrap-anywhere whitespace-pre-wrap">
            {visibleMessages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const isStreaming = status === "submitted" || status === "streaming";
              const isLastMessageStreaming =
                message.role === "assistant" && isStreaming && isLastMessage;
              return (
                <Message
                  key={message.id}
                  message={message}
                  onRetry={() => onRetry(index)}
                  isEditing={editingMessageIndex === index}
                  onEdit={() => onEdit(index)}
                  onEditSubmit={(newPromptData) => onEditSubmit(index, newPromptData)}
                  onEditCancel={onEditCancel}
                  isLastMessageStreaming={isLastMessageStreaming}
                  isGeneratingTheme={isGeneratingTheme}
                />
              );
            })}

            {/* Loading message when AI is generating */}
            {showLoadingMessage && (
              <div className="flex items-center gap-1.5">
                <div className="relative flex size-6 items-center justify-center">
                  <LoadingLogo />
                </div>

                <Loader variant="dots" size="sm" />
              </div>
            )}

            {/* Error message when generating theme fails */}
            {status === "error" && error && (
              <div className="flex w-[90%] items-start gap-1.5">
                <div
                  className={cn(
                    "border-border/50! bg-destructive relative flex size-6 shrink-0 items-center justify-center rounded-full border select-none"
                  )}
                >
                  <Logo className={cn("text-destructive-foreground size-full p-0.5")} />
                </div>

                <div
                  className={cn(
                    "bg-destructive/50 text-foreground group/error-banner relative flex w-full gap-2 rounded-lg p-3"
                  )}
                >
                  <p className="text-xs">{errorText}</p>

                  <TooltipWrapper label="Clear error" asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="invisible ml-auto size-4 shrink-0 group-hover/error-banner:visible [&>svg]:size-3"
                      onClick={clearError}
                    >
                      <X />
                    </Button>
                  </TooltipWrapper>
                </div>
              </div>
            )}
          </div>
          <div ref={scrollEndRef} />
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Bottom fade out effect when scrolling */}
      <div
        className={cn(
          "via-background/50 from-background pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-6 bg-gradient-to-t to-transparent opacity-100 transition-opacity ease-out",
          isScrollEnd ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}
