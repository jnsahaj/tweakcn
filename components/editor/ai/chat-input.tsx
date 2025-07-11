"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Loading } from "@/components/loading";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useDocumentDragAndDropIntent } from "@/hooks/use-document-drag-and-drop-intent";
import { useImageUpload } from "@/hooks/use-image-upload";
import { AI_PROMPT_CHARACTER_LIMIT, MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { useAILocalDraftStore } from "@/store/ai-local-draft-store";
import { AIPromptData } from "@/types/ai";
import { convertJSONContentToPromptData } from "@/utils/ai/ai-prompt";
import { JSONContent } from "@tiptap/react";
import { ArrowUp, Loader, Plus, StopCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { AlertBanner } from "./alert-banner";
import { DragAndDropImageUploader } from "./drag-and-drop-image-uploader";
import { ImageUploader } from "./image-uploader";
import { UploadedImagePreview } from "./uploaded-image-preview";

const CustomTextarea = dynamic(() => import("@/components/editor/custom-textarea"), {
  ssr: false,
  loading: () => <Loading className="min-h-[60px] w-full rounded-lg" />,
});

export function ChatInput({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (
    promptData: AIPromptData | null,
    handlers?: { onThemeGenerateInvoked?: () => void }
  ) => Promise<void>;
}) {
  const { messages, clearMessages } = useAIChatStore();
  const { loading: aiGenerateLoading, cancelThemeGeneration } = useAIThemeGeneration();

  const { isUserDragging } = useDocumentDragAndDropIntent();

  // Images uploads are local. We should upload them to a remote storage as soon as the user uploads them.
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
    clearUploadedImages,
    isSomeImageUploading,
  } = useImageUpload({
    maxFiles: MAX_IMAGE_FILES,
    maxFileSize: MAX_IMAGE_FILE_SIZE,
    initialImages: imagesDraft.map(({ url }) => ({ url, loading: false })),
  });

  // Sync the imagesDraft with the local uploadedImages
  useEffect(() => {
    setImagesDraft(uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url })));
  }, [uploadedImages]);

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

    const promptDataToSend = {
      ...promptData,
      content: promptData?.content ?? "",
      mentions: promptData?.mentions ?? [],
      images,
    };

    handleThemeGeneration(promptDataToSend, {
      onThemeGenerateInvoked() {
        clearUploadedImages();
        clearLocalDraft();
      },
    });
  };

  const handleContentChange = (jsonContent: JSONContent) => {
    setEditorContentDraft(jsonContent);
  };

  const handleNewChat = () => {
    clearMessages();
    clearLocalDraft();
    clearUploadedImages();
  };

  return (
    <div className="relative transition-all contain-layout">
      <AlertBanner />
      <div className="bg-background relative isolate z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
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
          <div className="bg-muted/40 relative isolate rounded-lg">
            <CustomTextarea
              onContentChange={handleContentChange}
              onGenerate={handleGenerate}
              key={messages.length}
              characterLimit={AI_PROMPT_CHARACTER_LIMIT}
              onImagesPaste={handleImagesUpload}
              initialEditorContent={editorContentDraft}
            />
          </div>
        </div>
        <div className="@container/form flex items-center justify-between gap-2">
          <TooltipWrapper label="Create new chat" asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              disabled={aiGenerateLoading || messages.length === 0}
              className="flex items-center gap-1.5 shadow-none"
            >
              <Plus />
              <span>New chat</span>
            </Button>
          </TooltipWrapper>

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
              <TooltipWrapper label="Cancel generation" asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={cancelThemeGeneration}
                  className={cn("flex items-center gap-1.5 shadow-none", "@max-[350px]/form:w-8")}
                >
                  <StopCircle />
                  <span className="hidden @[350px]/form:inline-flex">Stop</span>
                </Button>
              </TooltipWrapper>
            ) : (
              <TooltipWrapper label="Send message" asChild>
                <Button
                  size="sm"
                  className="size-8 shadow-none"
                  onClick={handleGenerate}
                  disabled={isEmptyPrompt || isSomeImageUploading || aiGenerateLoading}
                >
                  {aiGenerateLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
                </Button>
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
