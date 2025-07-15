"use client";

import { AlertBanner } from "@/components/editor/ai/alert-banner";
import { ImageUploader } from "@/components/editor/ai/image-uploader";
import ThemePresetSelect from "@/components/editor/theme-preset-select";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import { ArrowUp, Loader, StopCircle } from "lucide-react";
import { useAIChatForm } from "@/hooks/use-ai-chat-form";
import { AIChatFormBody } from "@/components/editor/ai/ai-chat-form-body";

export function AIChatForm({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const { loading: aiGenerateLoading, cancelThemeGeneration } = useAIThemeGeneration();
  const {
    editorContentDraft,
    handleContentChange,
    promptData,
    isEmptyPrompt,
    clearLocalDraft,
    uploadedImages,
    fileInputRef,
    handleImagesUpload,
    handleImageRemove,
    isSomeImageUploading,
    isUserDragging,
  } = useAIChatForm();

  const handleGenerate = async () => {
    // Only send images that are not loading, and strip loading property
    const images = uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url }));

    // Proceed only if there is text, or at least one image
    if (isEmptyPrompt && images.length === 0) return;

    handleThemeGeneration({
      ...promptData,
      content: promptData?.content ?? "",
      mentions: promptData?.mentions ?? [],
      images,
    });

    clearLocalDraft();
  };

  return (
    <div className="@container/form relative transition-all contain-layout">
      <AlertBanner />

      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
        <AIChatFormBody
          isUserDragging={isUserDragging}
          aiGenerateLoading={aiGenerateLoading}
          uploadedImages={uploadedImages}
          handleImagesUpload={handleImagesUpload}
          handleImageRemove={handleImageRemove}
          handleContentChange={handleContentChange}
          handleGenerate={handleGenerate}
          initialEditorContent={editorContentDraft ?? undefined}
        />

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
              onImagesUpload={handleImagesUpload}
              onClick={() => fileInputRef.current?.click()}
              disabled={
                aiGenerateLoading ||
                uploadedImages.some((img) => img.loading) ||
                uploadedImages.length >= MAX_IMAGE_FILES
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
                disabled={isEmptyPrompt || isSomeImageUploading || aiGenerateLoading}
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
