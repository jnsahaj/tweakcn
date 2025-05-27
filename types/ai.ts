import { type JSONContent } from "@tiptap/react";
import { type ThemeStyles } from "./theme";

export type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
  themeStyles?: ThemeStyles;
};

export type UserMessage = {
  content: string;
};

export type AssistantMessage = {
  content: string;
  themeStyles?: ThemeStyles;
};
