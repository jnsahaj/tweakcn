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

const convertJSONContentToPromptData = (jsonContent: JSONContent): AIPromptData => {
  const content =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonContent.content?.[0]?.content?.reduce((text: string, node: any) => {
      if (node.type === "text") return text + node.text;
      if (node.type === "mention") return text + `@${node.attrs?.label}`;
      return text;
    }, "") || "";

  const mentions: MentionReference[] =
    jsonContent.content?.[0]?.content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.filter((node: any) => node.type === "mention")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-2 before:left-3 before:text-mauve-11 before:opacity-50 before-pointer-events-none",
      }),
      CharacterCount.configure({
        limit: characterLimit,
      }),
    ],
    autofocus: !aiGenerateLoading,
    editorProps: {
      attributes: {
        class:
          "min-h-[60px] max-h-[150px] wrap-anywhere text-foreground/90 scrollbar-thin overflow-y-auto w-full rounded-md bg-background px-3 py-2 pb-6 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 max-sm:text-[16px]!",
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
