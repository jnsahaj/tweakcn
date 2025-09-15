"use client";

import { PillActionButton } from "@/components/editor/ai/pill-action-button";
import { useImageUpload } from "@/hooks/use-image-upload";
import { imageUploadReducer } from "@/hooks/use-image-upload-reducer";
import { MAX_IMAGE_FILE_SIZE } from "@/lib/constants";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt } from "@/utils/ai/ai-prompt";
import { PROMPTS } from "@/utils/ai/prompts";
import { ImageIcon, Sparkles } from "lucide-react";
import { useEffect, useReducer } from "react";

export function SuggestedPillActions({
  onThemeGeneration,
  isGeneratingTheme,
}: {
  onThemeGeneration: (promptData: AIPromptData) => void;
  isGeneratingTheme: boolean;
}) {
  const [uploadedImages, dispatch] = useReducer(imageUploadReducer, []);

  const { fileInputRef, handleImagesUpload, canUploadMore, isSomeImageUploading } = useImageUpload({
    maxFiles: 1,
    maxFileSize: MAX_IMAGE_FILE_SIZE,
    images: uploadedImages,
    dispatch,
  });

  // Automatically send prompt when an image is selected and loaded
  useEffect(() => {
    if (uploadedImages.length > 0 && !isSomeImageUploading) {
      onThemeGeneration({
        content: "", // No text prompt
        mentions: [], // No mentions
        images: [uploadedImages[0]],
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImages, isSomeImageUploading]);

  const handleSetPrompt = async (prompt: string) => {
    const promptData = createCurrentThemePrompt({ prompt });
    onThemeGeneration(promptData);
  };

  const handleImageButtonClick = () => {
    if (canUploadMore && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);
    handleImagesUpload(files);
  };

  return (
    <>
      <PillActionButton onClick={handleImageButtonClick} disabled={isGeneratingTheme}>
        <input
          type="file"
          accept="image/*"
          multiple={false}
          ref={fileInputRef}
          onChange={handleImageUpload}
          disabled={isGeneratingTheme}
          style={{ display: "none" }}
        />
        <ImageIcon /> From an Image
      </PillActionButton>

      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <PillActionButton
          key={key}
          onClick={() => handleSetPrompt(prompt)}
          disabled={isGeneratingTheme}
        >
          <Sparkles /> {label}
        </PillActionButton>
      ))}
    </>
  );
}
