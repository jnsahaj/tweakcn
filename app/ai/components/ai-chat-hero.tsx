"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { cn } from "@/lib/utils";
import { AIChatForm } from "./ai-chat-form";
import { ChatHeading } from "./chat-heading";
import { SuggestedPillActions } from "./suggested-pill-actions";

export function AIChatHero() {
  return (
    <div className="relative isolate flex w-full flex-1 overflow-hidden">
      <div className="@container relative isolate z-1 mx-auto flex max-w-[49rem] flex-1 flex-col justify-center px-4">
        <ChatHeading />

        {/* Chat form input and suggestions */}
        <div className="relative mx-auto flex w-full flex-col">
          <div className="relative isolate z-10 w-full">
            <AIChatForm />

            {/* Background gradients */}
            <div
              className={cn(
                "animate-in fade-in pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_10%_70%,var(--secondary),transparent_15%)] opacity-0 blur-2xl duration-500 lg:opacity-100 lg:dark:opacity-50"
              )}
            />
            <div
              className={cn(
                "animate-in fade-in pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_90%_30%,var(--primary),transparent_15%)] opacity-0 blur-2xl duration-500 lg:opacity-100 lg:dark:opacity-50"
              )}
            />
          </div>

          {/* Quick suggestions */}
          <HorizontalScrollArea className="mx-auto pt-4 pb-2">
            <SuggestedPillActions />
          </HorizontalScrollArea>
        </div>
      </div>
    </div>
  );
}
