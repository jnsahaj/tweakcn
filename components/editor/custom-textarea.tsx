"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { suggestion } from "@/components/editor/mention-suggestion";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { AIPromptData, MentionReference } from "@/types/ai";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";

interface CustomTextareaProps {
  onContentChange: (promptData: AIPromptData) => void;
  onGenerate?: () => void;
}

const convertJSONContentToPromptData = (jsonContent: JSONContent): AIPromptData => {
  const content =
    jsonContent.content?.[0]?.content?.reduce((text: string, node: any) => {
      if (node.type === "text") return text + node.text;
      if (node.type === "mention") return text + `@${node.attrs?.label}`;
      return text;
    }, "") || "";

  const mentions: MentionReference[] =
    jsonContent.content?.[0]?.content
      ?.filter((node: any) => node.type === "mention")
      ?.map((mention: any) => {
        const id = mention.attrs?.id;
        const label = mention.attrs?.label;

        let themeData;
        if (id === "editor:current-changes") {
          themeData = useEditorStore.getState().themeState.styles;
        } else {
          const preset = useThemePresetStore.getState().getPreset(id);
          themeData = preset?.styles || { light: {}, dark: {} };
        }

        return {
          id,
          label,
          themeData,
        };
      }) || [];

  return {
    content,
    mentions,
  };
};

const CustomTextarea: React.FC<CustomTextareaProps> = ({ onContentChange, onGenerate }) => {
  const { loading: aiGenerateLoading } = useAIThemeGeneration();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: suggestion,
      }),
      Placeholder.configure({
        placeholder: "Describe your theme...",
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-2 before:left-3 before:text-mauve-11 before:opacity-50 before-pointer-events-none",
      }),
    ],
    autofocus: !aiGenerateLoading,
    editorProps: {
      attributes: {
        class:
          "min-h-[60px] max-h-[150px] wrap-anywhere text-foreground/90 scrollbar-thin overflow-y-auto w-full rounded-md bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          const { state } = view;
          const mentionPluginKey = Mention.options.suggestion.pluginKey;

          if (!mentionPluginKey) {
            console.error("Mention plugin key not found.");
            return false;
          }

          const mentionState = mentionPluginKey.getState(state);

          if (mentionState?.active) {
            return false;
          } else {
            event.preventDefault();
            onGenerate?.();
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      const promptData = convertJSONContentToPromptData(jsonContent);
      onContentChange(promptData);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!aiGenerateLoading);
      editor.commands.blur();
    }
  }, [aiGenerateLoading, editor]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default CustomTextarea;
