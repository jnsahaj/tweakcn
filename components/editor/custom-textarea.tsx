"use client";

import { suggestion } from "@/components/editor/mention-suggestion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CharacterCount from "@tiptap/extension-character-count";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface CustomTextareaProps {
  className?: string;
  disabled?: boolean;
  canSubmit?: boolean;
  onContentChange: (jsonContent: JSONContent) => void;
  onSubmit: () => void;
  onImagesPaste?: (files: File[]) => void;
  characterLimit?: number;
  initialEditorContent?: JSONContent | null;
  externalEditorContent?: JSONContent | null;
  isStreamingContent?: boolean;
}

export default function CustomTextarea({
  className,
  disabled = false,
  canSubmit = false,
  onContentChange,
  onSubmit,
  onImagesPaste,
  characterLimit,
  initialEditorContent,
  externalEditorContent,
  isStreamingContent = false,
}: CustomTextareaProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
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
    autofocus: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "min-w-0 min-h-[50px] max-h-[120px] wrap-anywhere text-foreground/90 scrollbar-thin overflow-y-auto w-full bg-background p-1 text-sm focus-visible:outline-none max-sm:text-[16px]! transition-all",
          disabled && "opacity-75 pointer-events-none",
          className
        ),
      },
      handleKeyDown: (view, event) => {
        if (disabled) {
          event.preventDefault();
          return true;
        }

        if (event.key === "Enter" && !event.shiftKey && !disabled && canSubmit) {
          const mentionPluginKey = Mention.options.suggestion.pluginKey;

          if (!mentionPluginKey) {
            console.error("Mention plugin key not found.");
            return false;
          }

          const { state } = view;
          const mentionState = mentionPluginKey.getState(state);

          if (mentionState?.active) {
            return false;
          } else {
            event.preventDefault();
            onSubmit();
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        if (disabled) {
          event.preventDefault();
          return true;
        }

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
      if (disabled) return;
      editor.commands.focus("end");
    },
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      onContentChange(jsonContent);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
    if (disabled) editor.commands.blur();
    else editor.commands.focus("end");
  }, [disabled, editor]);

  // Stream external content into the editor
  useEffect(() => {
    if (!editor || !externalEditorContent || !isStreamingContent) return;

    try {
      const currentContent = JSON.stringify(editor.getJSON());
      const nextContent = JSON.stringify(externalEditorContent);
      if (currentContent === nextContent) return;

      // Preserve cursor position at the end
      editor.commands.setContent(externalEditorContent, false);
      editor.commands.focus("end");
    } catch (_e) {
      // If setContent fails for any reason, silently ignore; user can keep typing
    }
  }, [externalEditorContent, editor, isStreamingContent]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const isLimitExceeded = characterLimit && characterCount > characterLimit;
  const shouldShowCount = characterLimit && characterCount >= characterLimit * 0.9;

  return (
    <div className="relative isolate">
      <EditorContent editor={editor} aria-disabled={disabled} />
      {shouldShowCount && (
        <div className="absolute right-3 bottom-2 z-10 flex text-xs hover:opacity-0">
          <span
            className={cn(
              "bg-background/10 pointer-events-none rounded-full px-0.5 backdrop-blur-xs",
              isLimitExceeded ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {characterCount} / {characterLimit}
          </span>
        </div>
      )}
    </div>
  );
}
