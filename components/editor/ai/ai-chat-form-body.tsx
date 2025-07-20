"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Loading } from "@/components/loading";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { DragAndDropImageUploader } from "./drag-and-drop-image-uploader";
import { UploadedImagePreview } from "./uploaded-image-preview";

const CustomTextarea = dynamic(() => import("@/components/editor/custom-textarea"), {
  ssr: false,
  loading: () => <Loading className="min-h-[60px] w-full rounded-lg" />,
});

interface AIChatFormBodyProps {
  isUserDragging: boolean;
  aiGenerateLoading: boolean;
  uploadedImages: { url: string; loading: boolean }[];
  handleImagesUpload: (files: File[]) => void;
  handleImageRemove: (index: number) => void;
  handleContentChange: (jsonContent: JSONContent) => void;
  handleGenerate: () => void;
  initialEditorContent: JSONContent | undefined;
  textareaKey?: string | number;
}

export function AIChatFormBody({
  isUserDragging,
  aiGenerateLoading,
  uploadedImages,
  handleImagesUpload,
  handleImageRemove,
  handleContentChange,
  handleGenerate,
  initialEditorContent,
  textareaKey,
}: AIChatFormBodyProps) {
  return (
    <>
      {isUserDragging && (
        <div className={cn("flex h-16 items-center rounded-lg")}>
          <DragAndDropImageUploader
            onDrop={handleImagesUpload}
            disabled={aiGenerateLoading || uploadedImages.some((img) => img.loading)}
          />
        </div>
      )}
      {uploadedImages.length > 0 && !isUserDragging && (
        <div
          className={cn(
            "relative flex h-16 items-center rounded-lg",
            aiGenerateLoading && "pointer-events-none opacity-75"
          )}
        >
          <HorizontalScrollArea className="w-full">
            {uploadedImages.map((img, idx) => (
              <UploadedImagePreview
                key={idx}
                src={img.url}
                isImageLoading={img.loading}
                handleImageRemove={() => handleImageRemove(idx)}
              />
            ))}
          </HorizontalScrollArea>
        </div>
      )}
      <div className="min-h-[60px]">
        <label className="sr-only">Chat Input</label>
        <div className="bg-muted/40 relative isolate rounded-lg" aria-disabled={aiGenerateLoading}>
          <CustomTextarea
            onContentChange={handleContentChange}
            onGenerate={handleGenerate}
            key={textareaKey}
            characterLimit={AI_PROMPT_CHARACTER_LIMIT}
            onImagesPaste={handleImagesUpload}
            initialEditorContent={initialEditorContent}
          />
        </div>
      </div>
    </>
  );
}
