import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { AIPromptData, MentionReference, PromptImage } from "@/types/ai";
import { JSONContent } from "@tiptap/react";

export const getTextContent = (promptData: AIPromptData | null) => {
  if (!promptData) return "";
  return promptData.content;
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
    (m) => `@${m.label.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`
  );
  const mentionRegex = new RegExp(`(${mentionPatterns.join("|")})`, "g");

  const parts = promptData.content.split(mentionRegex);
  const textContent = parts.flatMap((part, index) => {
    const mention = promptData.mentions.find((m) => `@${m.label}` === part);
    if (mention) {
      return (
        <span key={index} className="mention">
          {part}
        </span>
      );
    }
    // Split by \n and interleave <br /> to show line breaks in the messages UI
    // without this, the line breaks are not shown and the user message looks messy.
    const lines = part.split("\n");
    return lines.flatMap((line, i) => (i === 0 ? line : [<br key={`br-${index}-${i}`} />, line]));
  });

  return textContent;
};

export function attachCurrentThemeMention(promptData: AIPromptData): AIPromptData {
  const currentThemeData = useEditorStore.getState().themeState.styles;

  const mentionReference: MentionReference = {
    id: "editor:current-changes",
    label: "Current Theme",
    themeData: currentThemeData,
  };

  const promptDataWithMention = {
    ...promptData,
    mentions: [...promptData.mentions, mentionReference],
  };
  return promptDataWithMention;
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

export function createPromptDataFromPreset(prompt: string, presetName: string): AIPromptData {
  const preset = useThemePresetStore.getState().getPreset(presetName);

  if (!preset) {
    throw new Error(`Preset "${presetName}" not found`);
  }

  return {
    content: prompt,
    mentions: [
      {
        id: presetName,
        label: preset.label ?? presetName,
        themeData: {
          light: preset.styles.light || {},
          dark: preset.styles.dark || {},
        },
      },
    ],
  };
}

// Utility function to extract text content (user prompt) and theme mentions from the JSON content
// we need both separate to create the prompt data to send to the AI
// we also need to handle the line breaks correctly, both in copy/paste and while typing directly
export function extractTextContentAndMentions(node: JSONContent): {
  content: string;
  mentions: MentionReference[];
} {
  const textArr: string[] = [];
  const mentionsArr: MentionReference[] = [];

  // This is a recursive function that walks through the JSON content (even nested) and extracts the text content and mentions
  const walk = (n: JSONContent) => {
    if (n.type === "text") {
      textArr.push(n.text || "");
    }
    if (n.type === "mention") {
      textArr.push(`@${n.attrs?.label}`);
      const id = n.attrs?.id;
      const label = n.attrs?.label;
      let themeData;
      if (id === "editor:current-changes") {
        themeData = useEditorStore.getState().themeState.styles;
      } else {
        const preset = useThemePresetStore.getState().getPreset(id);
        themeData = preset?.styles || { light: {}, dark: {} };
      }
      mentionsArr.push({ id, label, themeData });
    }
    if (n.type === "hardBreak") {
      textArr.push("\n");
    }
    if (n.content) {
      n.content.forEach((child) => walk(child));
    }
  };

  const blocks = node.content;
  if (Array.isArray(blocks) && blocks.length > 0) {
    blocks.forEach((block, idx) => {
      walk(block);
      if (idx < blocks.length - 1) {
        textArr.push("\n");
      }
    });
  } else {
    walk(node);
  }

  const formattedText = textArr.join("").replace(/\\n/g, "\n");

  return { content: formattedText, mentions: mentionsArr };
}

export function convertJSONContentToPromptData(jsonContent: JSONContent): AIPromptData {
  const { content, mentions } = extractTextContentAndMentions(jsonContent);
  return { content, mentions };
}

/**
 * Converts AIPromptData (content + mentions) to JSONContent for initializing the editor.
 * Mentions are inserted as inline nodes, and line breaks are preserved as hardBreak nodes.
 * This matches the structure produced by Tiptap for multi-line content.
 */
export function convertPromptDataToJSONContent(promptData: AIPromptData): JSONContent {
  const { content, mentions } = promptData;
  const mentionMap = new Map(mentions.map((m) => [m.label, m]));
  // Regex to match @mentions (e.g., @Current Theme)
  const mentionRegex = /@([\w\s\-:]+)/g;

  // Split content into lines, preserving empty lines
  const lines = content.split(/\n/);
  const nodes: any[] = [];

  lines.forEach((line, lineIdx) => {
    let lastIndex = 0;
    let match;
    // Find all mentions in the line
    while ((match = mentionRegex.exec(line)) !== null) {
      const [fullMatch, label] = match;
      const mention = mentionMap.get(label);
      // Add text before the mention
      if (match.index > lastIndex) {
        nodes.push({ type: "text", text: line.slice(lastIndex, match.index) });
      }
      // Add the mention node
      if (mention) {
        nodes.push({
          type: "mention",
          attrs: {
            id: mention.id,
            label: mention.label,
          },
        });
      } else {
        // Fallback: treat as plain text
        nodes.push({ type: "text", text: fullMatch });
      }
      lastIndex = match.index + fullMatch.length;
    }
    // Add any remaining text after the last mention
    if (lastIndex < line.length) {
      nodes.push({ type: "text", text: line.slice(lastIndex) });
    }
    // Add hardBreak if not the last line (to preserve line breaks)
    if (lineIdx < lines.length - 1) {
      nodes.push({ type: "hardBreak" });
    }
  });

  // If the content is empty, ensure at least one empty text node
  if (nodes.length === 0) {
    nodes.push({ type: "text", text: "" });
  }

  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: nodes,
      },
    ],
  };
}

export function isEmptyPromptData(
  promptData?: AIPromptData,
  uploadedImages?: PromptImage[]
): boolean {
  const isEmptyPromptDataContent = !promptData?.content?.trim() || promptData?.content.length === 0;
  const isEmptyPromptDataImages = !!uploadedImages && uploadedImages.length === 0;

  return isEmptyPromptDataImages && isEmptyPromptDataContent;
}
