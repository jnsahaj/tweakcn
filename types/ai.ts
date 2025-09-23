import { THEME_GENERATION_TOOLS } from "@/lib/ai/generate-theme/tools";
import { DeepPartial, InferUITools, UIMessage, UIMessageStreamWriter } from "ai";
import { ThemeStylesWithoutSpacing, type ThemeStyleProps, type ThemeStyles } from "./theme";

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
  "generated-theme-styles":
    | {
        status: "streaming";
        themeStyles: DeepPartial<ThemeStylesWithoutSpacing>;
      }
    | {
        status: "ready";
        themeStyles: ThemeStylesWithoutSpacing;
      };
};

type ThemeGenerationUITools = InferUITools<typeof THEME_GENERATION_TOOLS>;
export type MyUITools = ThemeGenerationUITools;

export type ChatMessage = UIMessage<MyMetadata, MyUIDataParts, MyUITools>;

export type AdditionalAIContext = { writer: UIMessageStreamWriter<ChatMessage> };
