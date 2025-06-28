import { getLastGeneratedThemeStyles, useAIChatStore } from "@/store/ai-chat-store";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { AIPromptData, MentionReference } from "@/types/ai";

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
  // Create a regex that matches all possible mention patterns from the actual mentions
  const mentionPatterns = promptData.mentions.map(
    (m) => `@${m.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  );
  const mentionRegex = new RegExp(`(${mentionPatterns.join("|")})`, "g");

  const parts = promptData.content.split(mentionRegex);

  const textContent = parts.map((part, index) => {
    const mention = promptData.mentions.find((m) => `@${m.label}` === part);
    if (mention) {
      return (
        <span key={index} className="mention">
          {part}
        </span>
      );
    }
    return part;
  });

  if (promptData.image) {
    return (
      <div className="flex flex-col gap-2">
        <img
          src={promptData.image.preview}
          alt="Uploaded"
          className="max-w-32 rounded border object-cover"
        />
        <div>{textContent}</div>
      </div>
    );
  }

  return textContent;
};

export function attachCurrentThemeMention(promptData: AIPromptData): AIPromptData {
  const currentThemeData = useEditorStore.getState().themeState.styles;

  const mentionReference: MentionReference = {
    id: "editor:current-changes",
    label: "Current Theme",
    themeData: currentThemeData,
  };

  return {
    content: promptData.content,
    mentions: [...promptData.mentions, mentionReference],
  };
}

export function attachLastGeneratedThemeMention(promptData: AIPromptData): AIPromptData {
  const lastGeneratedThemeStyles = getLastGeneratedThemeStyles(useAIChatStore.getState().messages);
  if (!lastGeneratedThemeStyles) return promptData;

  const mentionReference: MentionReference = {
    id: "ai:last-generated-theme",
    label: "Last Generated Theme",
    themeData: lastGeneratedThemeStyles,
  };

  return {
    content: promptData.content,
    mentions: [...promptData.mentions, mentionReference],
  };
}

export function createCurrentThemePrompt({ prompt }: { prompt: string }): AIPromptData {
  const currentThemeData = useEditorStore.getState().themeState.styles;

  const mentionReference: MentionReference = {
    id: "editor:current-changes",
    label: "Current Theme",
    themeData: currentThemeData,
  };

  return {
    content: `Make the following changes to the @Current Theme:\n${prompt}`,
    mentions: [mentionReference],
  };
}

export function mentionsCurrentTheme(promptData: AIPromptData): boolean {
  return promptData.mentions.some((mention) => mention.id === "editor:current-changes");
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
