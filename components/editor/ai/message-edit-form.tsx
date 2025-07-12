import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useDocumentDragAndDropIntent } from "@/hooks/use-document-drag-and-drop-intent";
import { useImageUpload } from "@/hooks/use-image-upload";
import { AI_PROMPT_CHARACTER_LIMIT, MAX_IMAGE_FILES, MAX_IMAGE_FILE_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData, type ChatMessage as ChatMessageType } from "@/types/ai";
import {
  convertJSONContentToPromptData,
  convertPromptDataToJSONContent,
  isEmptyPromptData,
} from "@/utils/ai/ai-prompt";
import { JSONContent } from "@tiptap/react";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import CustomTextarea from "../custom-textarea";
import { DragAndDropImageUploader } from "./drag-and-drop-image-uploader";
import { ImageUploader } from "./image-uploader";
import { UploadedImagePreview } from "./uploaded-image-preview";

interface MessageEditFormProps {
  message: ChatMessageType;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
}

export function MessageEditForm({ message, onEditSubmit, onEditCancel }: MessageEditFormProps) {
  const promptData = message.promptData;

  const [editJsonContent, setEditJsonContent] = useState<JSONContent>(() => {
    if (!promptData) return { type: "doc", content: [] };
    return convertPromptDataToJSONContent(promptData);
  });

  const {
    fileInputRef,
    uploadedImages,
    handleImagesUpload,
    handleImageRemove,
    isSomeImageUploading,
    canUploadMore,
  } = useImageUpload({
    maxFiles: MAX_IMAGE_FILES,
    maxFileSize: MAX_IMAGE_FILE_SIZE,
    initialImages: promptData?.images
      ? promptData.images.map((img) => ({ ...img, loading: false }))
      : [],
  });

  const newPromptData = useMemo(
    () => convertJSONContentToPromptData(editJsonContent),
    [editJsonContent]
  );
  const isEmptyPrompt = isEmptyPromptData(newPromptData, uploadedImages);

  const handleEditConfirm = () => {
    if (isEmptyPrompt) return;

    onEditSubmit({
      ...promptData,
      ...newPromptData,
      images: uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url })),
    });
  };

  const { isUserDragging } = useDocumentDragAndDropIntent();

  return (
    <div className="bg-card/75 text-card-foreground/90 border-border/75! relative isolate flex size-full flex-col gap-2 self-end rounded-lg border p-2">
      {isUserDragging && (
        <div className={cn("flex h-16 items-center rounded-lg")}>
          <DragAndDropImageUploader
            onDrop={handleImagesUpload}
            disabled={uploadedImages.some((img) => img.loading)}
          />
        </div>
      )}
      {uploadedImages.length > 0 && !isUserDragging && (
        <div className={cn("relative flex h-16 items-center rounded-lg")}>
          <HorizontalScrollArea className="w-full">
            {uploadedImages.map((img, idx) => (
              <UploadedImagePreview
                key={idx}
                src={img.url}
                isImageLoading={img.loading}
                handleImageRemove={() => handleImageRemove(idx)}
                showPreviewOnHover={false}
              />
            ))}
          </HorizontalScrollArea>
        </div>
      )}

      <CustomTextarea
        onContentChange={setEditJsonContent}
        onGenerate={handleEditConfirm}
        characterLimit={AI_PROMPT_CHARACTER_LIMIT}
        onImagesPaste={handleImagesUpload}
        initialEditorContent={editJsonContent}
        className="min-h-none size-full max-h-[300px] bg-transparent"
      />

      <div className="@container/form flex items-center justify-between gap-2">
        <ImageUploader
          fileInputRef={fileInputRef}
          onImagesUpload={handleImagesUpload}
          onClick={() => fileInputRef.current?.click()}
          disabled={!canUploadMore}
        />

        <div className="flex items-center gap-2">
          <TooltipWrapper label="Cancel edit" asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditCancel}
              className="size-8 shadow-none"
            >
              <X />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper label="Confirm edit" asChild>
            <Button
              variant="secondary"
              size="sm"
              className="size-8 shadow-none"
              onClick={handleEditConfirm}
              disabled={isSomeImageUploading || isEmptyPrompt}
            >
              <Check />
            </Button>
          </TooltipWrapper>
        </div>
      </div>
    </div>
  );
}
