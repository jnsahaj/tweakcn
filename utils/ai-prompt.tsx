import { AIPromptData, MentionReference } from "@/types/ai";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";

export const getTextContent = (promptData: AIPromptData | null) => {
  if (!promptData) return "";
  return promptData.content;
};

export const mentionsCount = (promptData: AIPromptData | null) => {
  if (!promptData) return 0;
  return promptData.mentions.length;
};

export const buildPromptForAPI = (promptData: AIPromptData) => {
  const mentionReferences = promptData.mentions.map(
    (mention) => `@${mention.label} = 
  ${JSON.stringify(mention.themeData)}`
  );

  return `${promptData.content}\n\n${mentionReferences.join("\n")}`;
};

export const buildAIPromptRender = (promptData: AIPromptData): React.ReactNode => {
  let displayText = promptData.content;

  promptData.mentions.forEach((mention) => {
    displayText = displayText.replace(new RegExp(`@${mention.label}`, "g"), `@${mention.label}`);
  });

  return displayText;
};

export function createCurrentThemePrompt({ prompt }: { prompt: string }): AIPromptData {
  const currentThemeData = useEditorStore.getState().themeState.styles;

  const mentionReference: MentionReference = {
    id: "editor:current-changes",
    label: "Current Theme",
    themeData: currentThemeData,
  };

  return {
    content: `Make the following changes based on @Current Theme:\n${prompt}`,
    mentions: [mentionReference],
  };
}

export function createPromptDataFromMentions(content: string, mentionIds: string[]): AIPromptData {
  const mentions: MentionReference[] = mentionIds.map((id) => {
    if (id === "editor:current-changes") {
      return {
        id,
        label: "Current Theme",
        themeData: useEditorStore.getState().themeState.styles,
      };
    }

    const preset = useThemePresetStore.getState().getPreset(id);
    if (!preset) {
      throw new Error(`Theme preset not found: ${id}`);
    }

    return {
      id,
      label: preset.label || id,
      themeData: preset.styles,
    };
  });

  return {
    content,
    mentions,
  };
}
