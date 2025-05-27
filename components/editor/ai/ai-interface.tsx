"use client";

import { cn } from "@/lib/utils";
import { AIChatForm } from "./ai-chat-form";
import { ChatMessages } from "./chat-messages";
import { ClosableSuggestedPillActions } from "./suggested-pill-actions";

export function AIInterface() {
  return (
    <section className="@container relative isolate z-1 mx-auto flex h-full w-full max-w-[49rem] flex-1 flex-col justify-center">
      <div
        className={cn(
          "relative flex w-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-out"
        )}
      >
        <ChatMessages />
      </div>

      {/* Chat form input and suggestions */}
      <div className="relative mx-auto flex w-full flex-col">
        <div className="relative isolate z-10 w-full">
          <ClosableSuggestedPillActions />
          <AIChatForm />
        </div>
      </div>

      <p className="text-muted-foreground truncate py-2 text-center text-xs tracking-tight">
        tweakcn may make mistakes. Please use with discretion.
      </p>
    </section>
  );
}
