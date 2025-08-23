import { THEME_GENERATION_TOOLS } from "@/app/api/generate-theme/tools";
import { InferUITools, UIMessage } from "ai";
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

export type MyMetadata = {
  promptData?: AIPromptData;
  themeStyles?: ThemeStyles;
};

export type MyUIDataParts = {
  "generated-theme-styles": {
    themeStyles: ThemeStyles;
  };
};

type ThemeGenerationUITools = InferUITools<typeof THEME_GENERATION_TOOLS>;
export type MyUITools = ThemeGenerationUITools;

export type ChatMessage = UIMessage<MyMetadata, MyUIDataParts, MyUITools>;
