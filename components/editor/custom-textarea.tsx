"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { suggestion } from "@/components/editor/mention-suggestion"; // We'll create this next
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";

interface CustomTextareaProps {
  onContentChange: (textContent: string, jsonContent: JSONContent) => void;
  onGenerate?: () => void;
}

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
          "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          const { state } = view;
          const mentionPluginKey = Mention.options.suggestion.pluginKey;

          // Ensure the plugin key exists before trying to get state
          if (!mentionPluginKey) {
            console.error("Mention plugin key not found.");
            // Fallback: allow default Enter behavior if key is missing
            return false;
          }

          const mentionState = mentionPluginKey.getState(state);

          if (mentionState?.active) {
            // Mention list is active, let the mention extension handle Enter.
            return false;
          } else {
            // Mention list is not active, submit the prompt.
            event.preventDefault();
            onGenerate?.();
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getText(), editor.getJSON());
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
