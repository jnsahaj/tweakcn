import { type ThemeStyleProps, type ThemeStyles } from "./theme";

export type MentionReference = {
  id: string;
  label: string;
  themeData: {
    light: Partial<ThemeStyleProps>;
    dark: Partial<ThemeStyleProps>;
  };
};

export type PromptImage = {
  url: string;
};

export type AIPromptData = {
  content: string;
  mentions: MentionReference[];
  images?: PromptImage[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  timestamp: number;
  promptData?: AIPromptData;
  content?: string;
  themeStyles?: ThemeStyles;
};

export type UserMessage = {
  promptData: AIPromptData;
};

export type AssistantMessage = {
  content: string;
  themeStyles?: ThemeStyles;
};
