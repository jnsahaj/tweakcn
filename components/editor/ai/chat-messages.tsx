import Logo from "@/assets/logo.svg";
import { CopyButton } from "@/components/copy-button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { type ChatMessage as ChatMessageType } from "@/types/ai";
import { ThemeStyles } from "@/types/theme";
import { buildAIPromptRender } from "@/utils/ai-prompt";
import { Goal, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ColorPreview from "../theme-preview/color-preview";
import { ChatThemePreview } from "./chat-theme-preview";
import { LoadingLogo } from "./loading-logo";

type ChatMessagesProps = {
  onRetry?: (messageIndex: number) => void;
};

export function ChatMessages({ onRetry }: ChatMessagesProps) {
  const [isScrollTop, setIsScrollTop] = useState(true);
  const { messages } = useAIChat();
  const { loading: isAIGenerating } = useAIThemeGeneration();
  const previousMessages = useRef<ChatMessageType[]>(messages);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      // When switching tabs, messages do not change, so we don't need to animate the scroll
      const didMessagesChange = previousMessages.current.length !== messages.length;
      messagesEndRef.current.scrollIntoView({ behavior: didMessagesChange ? "smooth" : "auto" });

      // Update the previous messages ref
      previousMessages.current = messages;
    }
  }, [messages, isAIGenerating]);

  // Toggle top fade out effect when scrolling
  useEffect(() => {
    const scrollInnerContainer = document.getElementById("scroll-inner-container");
    if (!scrollInnerContainer) return;

    const handleScroll = () => setIsScrollTop(scrollInnerContainer?.scrollTop === 0);
    scrollInnerContainer.addEventListener("scroll", handleScroll);

    return () => scrollInnerContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top fade out effect when scrolling */}
      <div
        className={cn(
          "via-background/50 from-background pointer-events-none absolute top-0 right-0 left-0 z-20 h-8 bg-gradient-to-b to-transparent opacity-100 transition-opacity ease-out",
          isScrollTop ? "opacity-0" : "opacity-100"
        )}
      />
      <div id="scroll-inner-container" className="relative size-full flex-1 px-2 py-8">
        <div className="flex flex-col gap-8 text-pretty wrap-anywhere">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              messageIndex={index}
              onRetry={onRetry}
            />
          ))}

          {/* Loading message when AI is generating */}
          {isAIGenerating && (
            <div className="group/message flex gap-1.5">
              <div className="relative size-6">
                <LoadingLogo />
              </div>

              <p className="inline-flex animate-pulse gap-0.25 delay-150">
                <span className="text-sm">Generating</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
                <span className="animate-bounce delay-300">.</span>
              </p>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}

type ChatMessageProps = {
  message: ChatMessageType;
  messageIndex?: number;
  onRetry?: (messageIndex: number) => void;
};

export default function ChatMessage({ message, messageIndex, onRetry }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const { themeState, setThemeState } = useEditorStore();
  const { loading: isAIGenerating } = useAIThemeGeneration();

  const handleResetThemeToMessageCheckpoint = (themeStyles?: ThemeStyles) => {
    if (!themeStyles) return;

    setThemeState({
      ...themeState,
      styles: themeStyles,
    });
  };

  const handleRetry = () => {
    if (messageIndex !== undefined && onRetry) {
      onRetry(messageIndex);
    }
  };

  const getDisplayContent = () => {
    if (isUser && message.promptData) {
      return buildAIPromptRender(message.promptData);
    }
    return message.content || "";
  };

  const getCopyContent = () => {
    if (isUser && message.promptData) {
      return message.promptData.content;
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
              "w-fit rounded-lg text-sm",
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

          <div
            className={cn(
              "mt-2 flex gap-2 opacity-0 transition-opacity duration-300 ease-out group-hover/message:opacity-100",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {isUser && onRetry && messageIndex !== undefined && (
              <TooltipWrapper label="Retry this prompt" asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6 [&>svg]:size-3.5"
                  disabled={isAIGenerating}
                  onClick={handleRetry}
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
        </div>
      </div>
    </div>
  );
}
