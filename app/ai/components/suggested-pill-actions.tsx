"use client";

import { PillActionButton } from "@/components/editor/ai/pill-action-button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useImageUpload } from "@/hooks/use-image-upload";
import { MAX_IMAGE_FILE_SIZE } from "@/lib/ai/ai-theme-generator";
import { AIPromptData } from "@/types/ai";
import { createCurrentThemePrompt } from "@/utils/ai/ai-prompt";
import { PROMPTS } from "@/utils/ai/prompts";
import { ImageIcon, Sparkles } from "lucide-react";
import { useEffect } from "react";

export function SuggestedPillActions({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const { loading: aiIsGenerating } = useAIThemeGeneration();

  const { fileInputRef, selectedImages, handleImageSelect, canUploadMore, isSomeImageUploading } =
    useImageUpload({
      maxFiles: 1,
      maxFileSize: MAX_IMAGE_FILE_SIZE,
    });

  // Automatically send prompt when an image is selected and loaded
  useEffect(() => {
    if (selectedImages.length > 0 && !isSomeImageUploading) {
      handleThemeGeneration({
        content: "", // No text prompt
        mentions: [], // No mentions
        images: [selectedImages[0]],
      });
    }
  }, [selectedImages, isSomeImageUploading]);

  const handleSetPrompt = async (prompt: string) => {
    const promptData = createCurrentThemePrompt({ prompt });
    handleThemeGeneration(promptData);
  };

  const handleImageButtonClick = () => {
    if (canUploadMore && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <PillActionButton
        onClick={handleImageButtonClick}
        disabled={!canUploadMore || isSomeImageUploading}
      >
        <input
          type="file"
          accept="image/*"
          multiple={false}
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
        <ImageIcon /> From an Image
      </PillActionButton>

      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <PillActionButton
          key={key}
          onClick={() => handleSetPrompt(prompt)}
          disabled={aiIsGenerating}
        >
          <Sparkles /> {label}
        </PillActionButton>
      ))}
    </>
  );
}
