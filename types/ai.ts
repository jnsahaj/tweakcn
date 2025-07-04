import { type ThemeStyles, type ThemeStyleProps } from "./theme";

export type MentionReference = {
  id: string;
  label: string;
  themeData: {
    light: Partial<ThemeStyleProps>;
    dark: Partial<ThemeStyleProps>;
  };
};

export type PromptImage = {
  file: File;
  preview: string;
};

// TODO: `image?: PromptImage` should be `images?: PromptImage[]` to support multiple images
export type AIPromptData = {
  content: string;
  mentions: MentionReference[];
  image?: PromptImage;
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
