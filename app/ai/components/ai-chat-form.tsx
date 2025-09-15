"use client";

import { AIChatFormBody } from "@/components/editor/ai/ai-chat-form-body";
import { AlertBanner } from "@/components/editor/ai/alert-banner";
import { EnhancePromptButton } from "@/components/editor/ai/enhance-prompt-button";
import { ImageUploader } from "@/components/editor/ai/image-uploader";
import ThemePresetSelect from "@/components/editor/theme-preset-select";
import { Button } from "@/components/ui/button";
import { useAIChatForm } from "@/hooks/use-ai-chat-form";
import { useAIEnhancePrompt } from "@/hooks/use-ai-enhance-prompt";
import { useGuards } from "@/hooks/use-guards";
import { MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import { ArrowUp, Loader, StopCircle } from "lucide-react";

export function AIChatForm({
  onThemeGeneration,
  isGeneratingTheme,
  onCancelThemeGeneration,
}: {
  onThemeGeneration: (promptData: AIPromptData) => void;
  isGeneratingTheme: boolean;
  onCancelThemeGeneration: () => void;
}) {
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
    isInitializing,
  } = useAIChatForm();

  const { checkValidSession, checkValidSubscription } = useGuards();

  const { startEnhance, stopEnhance, enhancedPromptAsJsonContent, isEnhancingPrompt } =
    useAIEnhancePrompt();

  const handleEnhancePrompt = () => {
    // TODO: Add subscription check, this should be a Pro only feature
    if (!checkValidSession() || !checkValidSubscription()) return; // Act as an early return;

    // Only send images that are not loading, and strip loading property
    const images = uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url }));
    startEnhance({ ...promptData, images });
  };

  const handleGenerate = async () => {
    if (!checkValidSession() || !checkValidSubscription()) return; // Act as an early return

    // Only send images that are not loading, and strip loading property
    const images = uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url }));

    // Proceed only if there is text, or at least one image
    if (isEmptyPrompt && images.length === 0) return;

    onThemeGeneration({
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
          disabled={isEnhancingPrompt}
          canSubmit={
            !isGeneratingTheme &&
            !isEnhancingPrompt &&
            !isEmptyPrompt &&
            !isSomeImageUploading &&
            !isInitializing
          }
          uploadedImages={uploadedImages}
          handleImagesUpload={handleImagesUpload}
          handleImageRemove={handleImageRemove}
          handleContentChange={handleContentChange}
          handleGenerate={handleGenerate}
          initialEditorContent={editorContentDraft ?? undefined}
          textareaKey={editorContentDraft ? "with-draft" : "no-draft"}
          externalEditorContent={isEnhancingPrompt ? enhancedPromptAsJsonContent : undefined}
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex w-full max-w-64 items-center gap-2 overflow-hidden">
            <ThemePresetSelect
              disabled={isGeneratingTheme || isEnhancingPrompt || isInitializing}
              withCycleThemes={false}
              variant="outline"
              size="sm"
              className="shadow-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* TODO: This should be a Pro only feature */}
            {promptData?.content ? (
              <EnhancePromptButton
                isEnhancing={isEnhancingPrompt}
                onStart={handleEnhancePrompt}
                onStop={stopEnhance}
                disabled={isGeneratingTheme || isInitializing}
              />
            ) : null}

            <ImageUploader
              fileInputRef={fileInputRef}
              onImagesUpload={handleImagesUpload}
              onClick={() => fileInputRef.current?.click()}
              disabled={
                isGeneratingTheme ||
                isEnhancingPrompt ||
                isInitializing ||
                uploadedImages.some((img) => img.loading) ||
                uploadedImages.length >= MAX_IMAGE_FILES
              }
            />

            {isGeneratingTheme ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={onCancelThemeGeneration}
                className={cn("flex items-center gap-1", "@max-[350px]/form:w-8")}
              >
                <StopCircle />
                <span className="hidden @[350px]/form:inline-flex">Stop</span>
              </Button>
            ) : (
              <Button
                size="icon"
                className="size-8 shadow-none"
                onClick={handleGenerate}
                disabled={
                  isEmptyPrompt ||
                  isSomeImageUploading ||
                  isGeneratingTheme ||
                  isEnhancingPrompt ||
                  isInitializing
                }
              >
                {isGeneratingTheme ? <Loader className="animate-spin" /> : <ArrowUp />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
