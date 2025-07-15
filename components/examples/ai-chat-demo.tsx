"use client";

import Message from "@/components/editor/ai/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/ai";
import { ThemeStyles } from "@/types/theme";
import { defaultPresets } from "@/utils/theme-presets";
import { useEffect, useRef } from "react";

export function AIChatDemo({
  disabled = true,
  className,
}: {
  disabled?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Always block tabbing: set tabIndex="-1" on all focusable children
    const focusables = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusables.forEach((el) => {
      (el as HTMLElement).setAttribute("tabindex", "-1");
      // Only set disabled if supported and disabled is true
      if (disabled && "disabled" in el) (el as HTMLButtonElement).disabled = true;
      if (!disabled && "disabled" in el) (el as HTMLButtonElement).disabled = false;
    });
  }, [disabled]);

  return (
    <div
      className={cn(
        "bg-background/50 flex h-full w-full min-w-[350px] origin-top-left flex-col overflow-hidden backdrop-blur-lg max-lg:scale-80"
      )}
      aria-hidden="true"
      tabIndex={-1}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      {/* Scrollable parent */}
      <ScrollArea className="flex-1">
        {/* Non-interactive chat content */}
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-4 p-4 select-none",
            disabled ? "pointer-events-none" : "",
            className
          )}
          aria-hidden="true"
          tabIndex={-1}
        >
          {CHAT_PLACEHOLDER_MESSAGES.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              onRetry={() => {}}
              isEditing={false}
              onEdit={() => {}}
              onEditSubmit={() => {}}
              onEditCancel={() => {}}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

const CHAT_PLACEHOLDER_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    timestamp: 1,
    content: "Can you generate a theme from this image?",
    promptData: {
      content: "Generate a theme from this image.",
      mentions: [],
      images: [
        {
          url: "/og-image.v050725.png",
        },
      ],
    },
  },
  {
    id: "2",
    role: "assistant",
    timestamp: 2,
    content:
      "I've generated a Midnight Bloom theme based on your image. It features deep purples and blues for a calming, modern look.",
    themeStyles: defaultPresets["midnight-bloom"].styles as ThemeStyles,
    promptData: undefined,
  },
  {
    id: "3",
    role: "user",
    timestamp: 3,
    content: "Can you generate a theme inspired by @Twitter?",
    promptData: undefined,
  },
  {
    id: "4",
    role: "assistant",
    timestamp: 4,
    content:
      "Alright, I've whipped up a Twitter-inspired theme. Expect bright blues and clean contrasts for a social, energetic vibe.",
    themeStyles: defaultPresets["twitter"].styles as ThemeStyles,
    promptData: undefined,
  },
  {
    id: "5",
    role: "user",
    timestamp: 5,
    content: "How about a @Supabase theme?",
    promptData: undefined,
  },
  {
    id: "6",
    role: "assistant",
    timestamp: 6,
    content:
      "I've generated a Supabase theme for you. It uses fresh greens and dark backgrounds for a modern, developer-friendly feel.",
    themeStyles: defaultPresets["supabase"].styles as ThemeStyles,
    promptData: undefined,
  },
];
