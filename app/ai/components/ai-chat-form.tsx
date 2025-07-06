"use client";

import { AlertBanner } from "@/components/editor/ai/alert-banner";
import { DragAndDropImageUploader } from "@/components/editor/ai/drag-and-drop-image-uploader";
import { ImageUploader } from "@/components/editor/ai/image-uploader";
import { UploadedImagePreview } from "@/components/editor/ai/uploaded-image-preview";
import ThemePresetSelect from "@/components/editor/theme-preset-select";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useDocumentDragAndDropIntent } from "@/hooks/useDocumentDragAndDropIntent";
import { AI_PROMPT_CHARACTER_LIMIT, MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import { convertFileArrayToFileList } from "@/utils/file-upload";
import { ArrowUp, Loader, StopCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const CustomTextarea = dynamic(() => import("@/components/editor/custom-textarea"), {
  ssr: false,
  loading: () => <Loading className="min-h-[60px] w-full rounded-lg" />,
});

export function AIChatForm({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const [promptData, setPromptData] = useState<AIPromptData | null>(null);
  const { loading: aiGenerateLoading, cancelThemeGeneration } = useAIThemeGeneration();

  const {
    fileInputRef,
    selectedImages,
    handleImageSelect,
    handleImageRemove,
    isSomeImageUploading,
  } = useImageUpload({
    maxFiles: MAX_IMAGE_FILES,
    maxFileSize: MAX_IMAGE_FILE_SIZE,
  });

  const { isUserDragging } = useDocumentDragAndDropIntent();

  const handleContentChange = (newPromptData: AIPromptData) => {
    setPromptData({ ...newPromptData });
  };

  const handleGenerate = async () => {
    // Only send images that are not loading, and strip loading property
    const images = selectedImages
      .filter((img) => !img.loading)
      .map(({ file, preview }) => ({ file, preview }));

    // Allow if there is text, or at least one image
    if ((!promptData?.content || promptData.content.trim().length === 0) && images.length === 0) {
      return;
    }

    handleThemeGeneration({
      ...promptData,
      content: promptData?.content ?? "",
      mentions: promptData?.mentions ?? [],
      images,
    });
  };

  const handleImageDrop = (files: File[]) => {
    if (!files || files.length === 0) return;

    // We want the dropped files to be treated as if they were selected from the regular file input
    // to perform the same logic and validations, so we create a synthetic event with the files.
    // - "react-dropzone" works with File[], while `handleImageSelect` expects a `HTMLInputElement` with a FileList
    const syntheticEvent = {
      target: { files: convertFileArrayToFileList(files) },
    } as React.ChangeEvent<HTMLInputElement>;

    handleImageSelect(syntheticEvent);
  };

  const isSendButtonDisabled =
    (selectedImages.length === 0 && !promptData?.content?.trim()) ||
    aiGenerateLoading ||
    isSomeImageUploading;

  return (
    <div className="@container/form relative transition-all contain-layout">
      <AlertBanner />

      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
        {isUserDragging && (
          <div className={cn("flex h-16 items-center rounded-lg")}>
            <DragAndDropImageUploader
              onDrop={handleImageDrop}
              disabled={aiGenerateLoading || selectedImages.some((img) => img.loading)}
            />
          </div>
        )}

        {selectedImages.length > 0 && !isUserDragging && (
          <div
            className={cn(
              "relative flex h-16 items-center rounded-lg",
              aiGenerateLoading && "pointer-events-none opacity-75"
            )}
          >
            <HorizontalScrollArea className="w-full">
              {selectedImages.map((img, idx) => (
                <UploadedImagePreview
                  key={idx}
                  imagePreview={img.preview}
                  isImageLoading={img.loading}
                  handleImageRemove={() => handleImageRemove(idx)}
                />
              ))}
            </HorizontalScrollArea>
          </div>
        )}

        <label className="sr-only">Chat Input</label>
        <div className={cn("min-h-[60px]", aiGenerateLoading && "pointer-events-none")}>
          <div
            className="bg-muted/40 relative isolate rounded-lg"
            aria-disabled={aiGenerateLoading}
          >
            <CustomTextarea
              onContentChange={handleContentChange}
              onGenerate={handleGenerate}
              characterLimit={AI_PROMPT_CHARACTER_LIMIT}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex w-full max-w-64 items-center gap-2 overflow-hidden">
            <ThemePresetSelect
              disabled={aiGenerateLoading}
              withCycleThemes={false}
              variant="outline"
              size="sm"
              className="shadow-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <ImageUploader
              fileInputRef={fileInputRef}
              handleImageSelect={handleImageSelect}
              onClick={() => fileInputRef.current?.click()}
              disabled={
                aiGenerateLoading ||
                selectedImages.some((img) => img.loading) ||
                selectedImages.length >= MAX_IMAGE_FILES
              }
            />

            {aiGenerateLoading ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={cancelThemeGeneration}
                className={cn("flex items-center gap-1", "@max-[350px]/form:w-8")}
              >
                <StopCircle />
                <span className="hidden @[350px]/form:inline-flex">Stop</span>
              </Button>
            ) : (
              <Button
                size="icon"
                className="size-8"
                onClick={handleGenerate}
                disabled={isSendButtonDisabled}
              >
                {aiGenerateLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
