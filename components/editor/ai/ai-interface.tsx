"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { AIChatForm } from "./ai-chat-form";
import { ClosableSuggestedPillActions } from "./closeable-suggested-pill-actions";

const ChatMessages = dynamic(() => import("./chat-messages").then((mod) => mod.ChatMessages), {
  ssr: false,
});

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
