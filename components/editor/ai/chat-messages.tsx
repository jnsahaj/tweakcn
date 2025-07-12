import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { cn } from "@/lib/utils";
import { AIPromptData, type ChatMessage as ChatMessageType } from "@/types/ai";
import { useEffect, useRef, useState } from "react";
import { LoadingLogo } from "./loading-logo";
import Message from "./message";

type ChatMessagesProps = {
  messages: ChatMessageType[];
  onRetry: (messageIndex: number) => void;
  onEdit: (messageIndex: number) => void;
  onEditSubmit: (messageIndex: number, newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
  editingMessageIndex?: number | null;
};

const FEEDBACK_MESSAGES = [
  "Generating", // 0-7s
  "Tweaking color tokens", // 8-15s
  "This might take some time", // 16-23s
  "Generating a good theme takes time", // 24-31s
  "Still working on your theme", // 32-39s
  "Almost there", // 40s+
];

const ROTATION_INTERVAL_IN_SECONDS = 8;

export function ChatMessages({
  messages,
  onRetry,
  onEdit,
  onEditSubmit,
  onEditCancel,
  editingMessageIndex,
}: ChatMessagesProps) {
  const [isScrollTop, setIsScrollTop] = useState(true);
  const { loading: isAIGenerating } = useAIThemeGeneration();
  const previousMessages = useRef<ChatMessageType[]>(messages);

  const [elapsedTimeGenerating, setElapsedTimeGenerating] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAIGenerating) {
      setElapsedTimeGenerating(0);

      interval = setInterval(() => {
        setElapsedTimeGenerating((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTimeGenerating(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAIGenerating]);

  const feedbackIndex = Math.min(
    Math.floor(elapsedTimeGenerating / ROTATION_INTERVAL_IN_SECONDS),
    FEEDBACK_MESSAGES.length - 1
  );
  const feedbackText = FEEDBACK_MESSAGES[feedbackIndex];

  const messagesStartRef = useRef<HTMLDivElement>(null);
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
    const startMarker = messagesStartRef.current;

    if (!startMarker) return;

    const observerOptions = {
      root: null, // Use viewport as root for more reliable detection
      threshold: 0,
    };

    const startMessagesObserver = new IntersectionObserver(([entry]) => {
      setIsScrollTop(entry.isIntersecting);
    }, observerOptions);

    startMessagesObserver.observe(startMarker);

    return () => startMessagesObserver.disconnect();
  }, []);

  return (
    <ScrollArea className="relative isolate flex flex-1 flex-col">
      {/* Top fade out effect when scrolling */}
      <div
        className={cn(
          "via-background/50 from-background pointer-events-none absolute top-0 right-0 left-0 z-20 h-8 bg-gradient-to-b to-transparent opacity-100 transition-opacity ease-out",
          isScrollTop ? "opacity-0" : "opacity-100"
        )}
      />
      <div className="relative size-full flex-1 px-6 pt-2 pb-8">
        <div ref={messagesStartRef} />
        <div className="flex flex-col gap-8 text-pretty wrap-anywhere">
          {messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              onRetry={() => onRetry(index)}
              isEditing={editingMessageIndex === index}
              onEdit={() => onEdit(index)}
              onEditSubmit={(newPromptData) => onEditSubmit(index, newPromptData)}
              onEditCancel={onEditCancel}
            />
          ))}

          {/* Loading message when AI is generating */}
          {isAIGenerating && (
            <div className="flex gap-1.5 pb-8">
              <div className="relative flex size-6 items-center justify-center">
                <LoadingLogo />
              </div>

              <p className="inline-flex animate-pulse gap-0.25 delay-150">
                <span className="text-sm">{feedbackText}</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
                <span className="animate-bounce delay-300">.</span>
              </p>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
