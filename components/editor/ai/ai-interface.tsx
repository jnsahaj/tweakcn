"use client";

import Logo from "@/assets/logo.svg";
import { useAIChat } from "@/hooks/use-ai-chat";
import { cn } from "@/lib/utils";
import { Sparkle } from "lucide-react";
import { AIChatForm } from "./ai-chat-form";
import { ChatHeading } from "./chat-heading";
import { ChatMessages } from "./chat-messages";
import { ClosableSuggestedPillActions } from "./suggested-pill-actions";

export function AIInterface() {
  const { messages } = useAIChat();
  const hasMessages = messages.length > 0;
  return (
    <section className="@container relative isolate z-1 mx-auto flex h-full w-full max-w-[49rem] flex-1 flex-col justify-center">
      <div
        className={cn(
          "flex flex-col transition-all ease-out",
          hasMessages ? "sr-only" : "scale-100"
        )}
      >
        <div className="bg-background relative isolate mx-auto size-10 rounded-full p-1 @3xl:size-12">
          <div className="absolute top-0 left-0 size-[30%]">
            <Sparkle className="size-full animate-pulse fill-current" />
          </div>
          <Logo className="size-full" />
          <div className="absolute right-0 bottom-0 size-[20%]">
            <Sparkle className="size-full animate-pulse fill-current delay-300" />
          </div>
        </div>
        <ChatHeading />
      </div>

      <div
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-lg transition-all duration-300 ease-out",
          hasMessages ? "flex-1" : "h-0 flex-none"
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
