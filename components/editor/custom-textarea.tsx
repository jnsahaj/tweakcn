"use client";

import { suggestion } from "@/components/editor/mention-suggestion";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { AIPromptData, MentionReference } from "@/types/ai";
import CharacterCount from "@tiptap/extension-character-count";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";

interface CustomTextareaProps {
  onContentChange: (promptData: AIPromptData) => void;
  onGenerate?: () => void;
  characterLimit?: number;
}

// Utility function to extract text content (user prompt) and theme mentions from the JSON content
// we need both separate to create the prompt data to send to the AI
// we also need to handle the line breaks correctly, both in copy/paste and while typing directly
const extractTextContentAndMentions = (
  node: JSONContent
): { content: string; mentions: MentionReference[] } => {
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
};

const convertJSONContentToPromptData = (jsonContent: JSONContent): AIPromptData => {
  const { content, mentions } = extractTextContentAndMentions(jsonContent);
  return { content, mentions };
};

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  onContentChange,
  onGenerate,
  characterLimit,
}) => {
  const { loading: aiGenerateLoading } = useAIThemeGeneration();
  const { toast } = useToast();

  const editor = useEditor({
    immediatelyRender: false,
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
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:inset-x-1 before:top-1 before:opacity-50 before-pointer-events-none",
      }),
      CharacterCount.configure({
        limit: characterLimit,
      }),
    ],
    autofocus: !aiGenerateLoading,
    editorProps: {
      attributes: {
        class:
          "min-h-[60px] max-h-[150px] wrap-anywhere text-foreground/90 scrollbar-thin overflow-y-auto w-full bg-background px-1 py-1 text-sm focus-visible:outline-none disabled:opacity-50 max-sm:text-[16px]!",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey && !aiGenerateLoading) {
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
      handlePaste: (_view, event) => {
        if (!characterLimit) return false;

        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const pastedText = clipboardData.getData("text/plain");
        const currentCharacterCount = editor?.storage.characterCount.characters() || 0;
        const totalCharacters = currentCharacterCount + pastedText.length;

        if (totalCharacters > characterLimit) {
          event.preventDefault();
          toast({
            title: "Text too long",
            description: `The pasted content would exceed the ${characterLimit} character limit.`,
            variant: "destructive",
          });
          return true;
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
      editor.commands.blur();
    }
  }, [aiGenerateLoading, editor]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const isLimitExceeded = characterLimit && characterCount > characterLimit;
  const shouldShowCount = characterLimit && characterCount >= characterLimit * 0.9;

  return (
    <div className="relative isolate">
      <EditorContent editor={editor} />
      {shouldShowCount && (
        <div className="pointer-events-none absolute right-3 bottom-2 z-10 flex text-xs">
          <span
            className={cn(
              "bg-background/10 rounded-full px-0.5 backdrop-blur-xs",
              isLimitExceeded ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {characterCount} / {characterLimit}
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomTextarea;
