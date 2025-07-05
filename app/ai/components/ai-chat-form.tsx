"use client";

import { AlertBanner } from "@/components/editor/ai/alert-banner";
import { ImageUploader } from "@/components/editor/ai/image-uploader";
import { UploadedImagePreview } from "@/components/editor/ai/uploaded-image-preview";
import ThemePresetSelect from "@/components/editor/theme-preset-select";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useImageUpload } from "@/hooks/use-image-upload";
import { MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/ai/ai-theme-generator";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
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

  const handleContentChange = (newPromptData: AIPromptData) => {
    setPromptData({ ...newPromptData });
  };

  const handleGenerate = async () => {
    // TODO: Allow empty content/text prompt message if images are provided
    if (!promptData?.content) return;

    const images = selectedImages
      .filter((img) => !img.loading)
      .map(({ file, preview }) => ({ file, preview }));

    handleThemeGeneration({ ...promptData, images });
  };

  const isSendButtonDisabled = !promptData?.content || aiGenerateLoading || isSomeImageUploading;

  return (
    <div className="@container/form relative transition-all contain-layout">
      <AlertBanner />

      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
        {selectedImages.length > 0 && (
          <div
            className={cn(
              "relative flex items-center gap-2",
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
          <div className="flex w-full max-w-68 items-center gap-2 overflow-hidden">
            <ThemePresetSelect disabled={aiGenerateLoading} withCycleThemes={false} />
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
