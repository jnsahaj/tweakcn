"use client";

import { FeaturedIcon } from "@/components/examples/application/featured-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, FileTextIcon, PhoneIcon, VideoIcon } from "lucide-react";
import * as React from "react";

type Message = {
  variant: "sent" | "received";
  type?: "text" | "file";
  content?: string;
  fileName?: string;
  fileSize?: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
};

const contact = {
  name: "Alex Rivera",
  avatar: "/examples/avatars/person-1.webp",
};

const initialMessages: Message[] = [
  {
    variant: "received",
    content: "Hey! Did you get a chance to look at the Q4 campaign deck I sent yesterday?",
    timestamp: "8:56 AM",
  },
  {
    variant: "sent",
    content: "Give me 30-40 min and I'll go through it properly. Anything you want my eyes on?",
    timestamp: "9:01 AM",
    reactions: [{ emoji: "❤️", count: 1 }],
  },
  {
    variant: "received",
    content:
      "Mainly the pricing page and the new color palette. Marketing thinks the green is too «crypto looking» lol",
    timestamp: "9:22 AM",
  },
  {
    variant: "sent",
    type: "file",
    fileName: "Q4_Campaign_Deck_Revised.pdf",
    fileSize: "4.8 MB",
    timestamp: "10:15 AM",
    reactions: [
      { emoji: "👍", count: 1 },
      { emoji: "👀", count: 1 },
    ],
  },
  {
    variant: "received",
    content: "Perfect! I see you updated the color scheme. This looks way better!",
    timestamp: "10:28 AM",
  },
];

export function MessagingPanel() {
  const [messages, setMessages] = React.useState(initialMessages);
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar>
              <AvatarImage src={contact.avatar} alt={contact.name} className="object-cover" />
              <AvatarFallback className="uppercase">AR</AvatarFallback>
            </Avatar>
            <span
              className="bg-chart-2 ring-background absolute right-0 bottom-0 size-2.5 shrink-0 rounded-full ring-2"
              aria-label="Online"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm leading-none font-medium">{contact.name}</p>
            <p className="text-muted-foreground text-xs">Online</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8">
            <PhoneIcon />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            <VideoIcon />
            <span className="sr-only">Video call</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        <TypingMessage />
      </CardContent>

      <CardFooter>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputLength === 0) return;
            setMessages([...messages, { variant: "sent", content: input, timestamp: "Now" }]);
            setInput("");
          }}
          className="relative w-full"
        >
          <Input
            placeholder="Type your message..."
            className="flex-1 pr-10"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2 rounded-full"
            disabled={inputLength === 0}
          >
            <ArrowUpIcon className="size-3.5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

function ChatMessage({
  variant,
  type = "text",
  content,
  fileName,
  fileSize,
  timestamp,
  reactions,
}: Message) {
  const isSent = variant === "sent";

  return (
    <div className={cn("flex items-start gap-3", isSent && "flex-row-reverse")}>
      {!isSent && <MessageAvatar />}

      <div
        className={cn(
          "relative isolate flex min-w-0 flex-col gap-2",
          isSent ? "items-end" : "items-start"
        )}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <span className="text-primary text-sm font-medium">{isSent ? "You" : contact.name}</span>
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        </div>

        <MessageBubble variant={variant} showTail={!isSent}>
          {type === "file" && fileName && fileSize ? (
            <div className="flex items-start gap-4">
              <FeaturedIcon>
                <FileTextIcon />
              </FeaturedIcon>
              <div className="grid min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{fileName}</p>
                <p className="text-sm opacity-70">{fileSize}</p>
              </div>
            </div>
          ) : (
            <p className="wrap-break-word whitespace-pre-wrap">{content}</p>
          )}
        </MessageBubble>

        {reactions && reactions.length > 0 && (
          <div className="z-10 -mt-4 flex flex-wrap gap-1 self-end pr-2">
            {reactions.map((reaction, index) => (
              <span
                key={index}
                className="bg-muted inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm font-medium"
              >
                <span className="leading-none">{reaction.emoji}</span>
                <span className="leading-none tabular-nums">{reaction.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingMessage() {
  return (
    <div className="flex items-start gap-3">
      <MessageAvatar />
      <MessageBubble variant="received" showTail>
        <div className="flex items-center gap-1 px-2 py-1" aria-label="Typing">
          <span className="bg-muted-foreground/60 size-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <span className="bg-muted-foreground/60 size-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <span className="bg-muted-foreground/60 size-2 animate-bounce rounded-full" />
        </div>
      </MessageBubble>
    </div>
  );
}

function MessageAvatar() {
  return (
    <Avatar className="shrink-0">
      <AvatarImage src={contact.avatar} alt={contact.name} className="object-cover" />
      <AvatarFallback className="uppercase">AR</AvatarFallback>
    </Avatar>
  );
}

function MessageBubble({
  variant,
  showTail = false,
  children,
}: {
  variant: Message["variant"];
  showTail?: boolean;
  children: React.ReactNode;
}) {
  const isSent = variant === "sent";

  return (
    <div
      className={cn(
        "relative isolate w-fit rounded-xl px-3 py-2 text-sm",
        isSent ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}
    >
      {children}

      {showTail && (
        <svg
          aria-hidden="true"
          width="20"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "absolute top-1 -z-1 h-6 w-5",
            isSent ? "text-primary -right-[5px] scale-x-[-1]" : "text-secondary -left-[5px]"
          )}
        >
          <path
            d="M0.132881 0.162838C6.27386 -0.781927 12.3361 2.5996 14.3044 4.76469C12.2756 9.60244 24.8006 21.3525 16.5339 21.3529C14.6224 21.3529 12.9898 26.3603 6.03767 22.601C6.01262 21.0813 6.03767 15.8209 6.03767 14.9253C6.03767 2.52522 -1.04808 0.875299 0.132881 0.162838Z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
}
