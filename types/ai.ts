import { type JSONContent } from "@tiptap/react";
import { type ThemeStyles } from "./theme";

export type ChatMessage = {
  id: string;
  content: string;
  jsonContent?: JSONContent;
  role: "user" | "assistant";
  timestamp: number;
  themeStyles?: ThemeStyles;
};

export type UserMessage = {
  content: string;
  jsonContent: JSONContent;
};

export type AssistantMessage = {
  content: string;
  jsonContent: JSONContent;
  themeStyles?: ThemeStyles;
};
