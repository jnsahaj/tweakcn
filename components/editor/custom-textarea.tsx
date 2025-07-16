"use client";

import { suggestion } from "@/components/editor/mention-suggestion";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CharacterCount from "@tiptap/extension-character-count";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";

interface CustomTextareaProps {
  onContentChange: (jsonContent: JSONContent) => void;
  onGenerate?: () => void;
  characterLimit?: number;
  onImagesPaste?: (files: File[]) => void;
  initialEditorContent?: JSONContent | null;
  className?: string;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  onContentChange,
  onGenerate,
  characterLimit,
  onImagesPaste,
  initialEditorContent,
  className,
}) => {
  const { loading: aiGenerateLoading } = useAIThemeGenerationCore();
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
        class: cn(
          "min-w-0 min-h-[60px] max-h-[150px] wrap-anywhere text-foreground/90 scrollbar-thin overflow-y-auto w-full bg-background px-1 py-1 text-sm focus-visible:outline-none disabled:opacity-50 max-sm:text-[16px]!",
          className
        ),
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

        // Check for image files
        if (onImagesPaste) {
          const files = Array.from(clipboardData.files);
          const imageFiles = files.filter((file) => file.type.startsWith("image/"));

          if (imageFiles.length > 0) {
            event.preventDefault();
            onImagesPaste(imageFiles);
            return true;
          }
        }

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
    content: initialEditorContent || "",
    onCreate: ({ editor }) => {
      editor.commands.focus("end");
    },
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      onContentChange(jsonContent);
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
