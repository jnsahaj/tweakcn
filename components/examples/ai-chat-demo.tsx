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
        "bg-transparent flex h-full w-full min-w-[350px] origin-top-left flex-col overflow-hidden"
      )}
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* Scrollable parent */}
      <ScrollArea className="flex-1">
        {/* Non-interactive chat content */}
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-6 p-6 select-none",
            disabled ? "pointer-events-none" : "",
            className
          )}
          aria-hidden="true"
          tabIndex={-1}
        >
          {CHAT_PLACEHOLDER_MESSAGES.map((msg) => (
            <Message
              key={msg.id}
              isGeneratingTheme={false}
              isLastMessageStreaming={false}
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
    parts: [
      {
        type: "text",
        text: "Can you generate a theme from this image?",
      },
    ],
    metadata: {
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
  },
  {
    id: "2",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I've generated a Midnight Bloom theme based on your image. It features deep purples and blues for a calming, modern look.",
      },
    ],
    metadata: {
      themeStyles: defaultPresets["midnight-bloom"].styles as ThemeStyles,
    },
  },
  {
    id: "3",
    role: "user",
    parts: [
      {
        type: "text",
        text: "Can you generate a theme inspired by @Twitter?",
      },
    ],
  },
  {
    id: "4",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Alright, I've whipped up a Twitter-inspired theme. Expect bright blues and clean contrasts for a social, energetic vibe.",
      },
    ],
    metadata: {
      themeStyles: defaultPresets["twitter"].styles as ThemeStyles,
    },
  },
  {
    id: "5",
    role: "user",
    parts: [
      {
        type: "text",
        text: "How about a @Supabase theme?",
      },
    ],
  },
  {
    id: "6",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I've generated a Supabase theme for you. It uses fresh greens and dark backgrounds for a modern, developer-friendly feel.",
      },
    ],
    metadata: {
      themeStyles: defaultPresets["supabase"].styles as ThemeStyles,
    },
  },
];
