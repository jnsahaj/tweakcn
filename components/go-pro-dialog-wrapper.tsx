"use client";

import Message from "@/components/editor/ai/message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useGoProDialogStore } from "@/store/go-pro-dialog-store";
import { ChatMessage } from "@/types/ai";
import { ThemeStyles } from "@/types/theme";
import { PRO_SUB_FEATURES } from "@/utils/subscription";
import { defaultPresets } from "@/utils/theme-presets";
import { Calendar, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { NoiseEffect } from "./effects/noise-effect";

export function GoProDialogWrapper() {
  const { isOpen, closeGoProDialog } = useGoProDialogStore();

  return <GoProDialog isOpen={isOpen} onClose={closeGoProDialog} />;
}

interface GoProDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function GoProDialog({ isOpen, onClose }: GoProDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden rounded-lg border p-0 md:max-w-2xl lg:max-w-4xl">
        <div className="flex flex-col md:flex-row">
          {/* Left section: content */}
          <section className="w-full space-y-12 border-r md:w-2/3 lg:w-1/2">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Go Pro </DialogTitle>
              <DialogDescription>{`Unlock all of tweakcn's features`}</DialogDescription>
            </DialogHeader>

            <div className="px-6">
              <ul className="space-y-3">
                {PRO_SUB_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-full p-1",
                        feature.status === "done" ? "bg-primary/15" : "bg-muted-foreground/25"
                      )}
                    >
                      {feature.status === "done" ? (
                        <Check className="text-primary size-3 stroke-2" />
                      ) : (
                        <Calendar className="text-muted-foreground size-3 stroke-2" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        feature.status === "done" ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {feature.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <DialogFooter className="bg-muted/30 relative border-t p-6">
              <div className="flex w-full items-center justify-end gap-2">
                <Button asChild className="grow">
                  <Link href="/pricing" onNavigate={onClose}>
                    Upgrade to Pro
                  </Link>
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Maybe later
                </Button>
              </div>
            </DialogFooter>
          </section>

          {/* Right section: chat preview, only visible md+ */}
          <section className="bg-muted/30 relative isolate hidden shrink-0 items-center justify-center overflow-hidden md:block md:w-1/3 lg:w-1/2">
            {/* ----Background effects---- */}
            <div
              className={cn(
                "absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(from_var(--primary)_r_g_b_/_0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--primary)_r_g_b_/_0.25)_1px,transparent_1px)] bg-[size:2rem_2rem]",
                "mask-r-from-80% mask-b-from-80% mask-radial-from-70% mask-radial-to-85%"
              )}
            />

            <NoiseEffect />
            <div
              className={cn(
                "absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(from_var(--muted-foreground)_r_g_b_/_0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(from_var(--muted-foreground)_r_g_b_/_0.025)_1px,transparent_1px)] bg-[size:2rem_2rem]"
              )}
            />
            <div className="bg-foreground/10 absolute top-0 left-0 -z-10 size-35 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-3xl" />
            <div className="bg-primary/15 absolute right-0 bottom-0 -z-10 size-70 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
            {/* ----Background effects---- */}

            <div className="absolute top-6 left-6 z-10 flex items-center justify-center lg:inset-6">
              <ChatPreview />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChatPreview() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // We want to disable all focusable selectors
    const focusables = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusables.forEach((el) => {
      (el as HTMLElement).setAttribute("tabindex", "-1");
      if ("disabled" in el) (el as HTMLButtonElement).disabled = true;
    });
  }, []);

  return (
    <div
      className="bg-background/50 flex h-full w-full min-w-[350px] origin-top-left flex-col overflow-hidden rounded-lg border shadow-lg backdrop-blur-lg max-lg:scale-80"
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* Scrollable parent */}
      <ScrollArea className="flex-1">
        {/* Non-interactive chat content */}
        <div
          ref={ref}
          className="pointer-events-none flex flex-col gap-4 p-4 select-none"
          aria-hidden="true"
        >
          {PLACEHOLDER_MESSAGES.map((msg) => (
            <Message key={msg.id} message={msg} onRetry={() => {}} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

const PLACEHOLDER_MESSAGES: ChatMessage[] = [
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
          file: { name: "og-image.v050725.png" } as File,
          preview: "/og-image.v050725.png",
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
