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
import { useDocumentDragAndDropIntent } from "@/hooks/use-document-drag-and-drop-intent";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useMounted } from "@/hooks/use-mounted";
import { AI_PROMPT_CHARACTER_LIMIT, MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAILocalDraftStore } from "@/store/ai-local-draft-store";
import { AIPromptData } from "@/types/ai";
import { convertJSONContentToPromptData } from "@/utils/ai/ai-prompt";
import { JSONContent } from "@tiptap/react";
import { ArrowUp, Loader, StopCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const CustomTextarea = dynamic(() => import("@/components/editor/custom-textarea"), {
  ssr: false,
  loading: () => <Loading className="min-h-[60px] w-full rounded-lg" />,
});

export function AIChatForm({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const isMounted = useMounted();
  const { loading: aiGenerateLoading, cancelThemeGeneration } = useAIThemeGeneration();

  const {
    editorContentDraft,
    setEditorContentDraft,
    clearLocalDraft,
    imagesDraft,
    setImagesDraft,
  } = useAILocalDraftStore();

  const {
    fileInputRef,
    uploadedImages,
    handleImagesUpload,
    handleImageRemove,
    isSomeImageUploading,
    setUploadedImages,
  } = useImageUpload({
    maxFiles: MAX_IMAGE_FILES,
    maxFileSize: MAX_IMAGE_FILE_SIZE,
  });

  // Syncs imagesDraft with uploadedImages every time the local images (uploadedImages) change
  useEffect(() => {
    if (!isMounted) return;
    setImagesDraft(uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url })));
  }, [uploadedImages, isMounted]);

  // This only syncs uploadedImages with imagesDraft when the component mounts
  useEffect(() => {
    if (!isMounted) return;
    setUploadedImages(imagesDraft.map(({ url }) => ({ url, loading: false })));
  }, [isMounted]);

  const { isUserDragging } = useDocumentDragAndDropIntent();

  // Derive promptData from editorContent
  const promptData = convertJSONContentToPromptData(
    editorContentDraft || { type: "doc", content: [] }
  );

  const isEmptyPrompt =
    uploadedImages.length === 0 &&
    (!promptData?.content?.trim() || promptData.content.length === 0);

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

  const handleContentChange = (jsonContent: JSONContent) => {
    setEditorContentDraft(jsonContent);
  };

  return (
    <div className="@container/form relative transition-all contain-layout">
      <AlertBanner />

      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
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
              onImagesPaste={handleImagesUpload}
              initialEditorContent={editorContentDraft}
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
