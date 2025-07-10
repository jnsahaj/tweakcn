"use client";

import { PillActionButton } from "@/components/editor/ai/pill-action-button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useImageUpload } from "@/hooks/use-image-upload";
import { MAX_IMAGE_FILE_SIZE } from "@/lib/constants";
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

  const { fileInputRef, uploadedImages, handleImagesUpload, canUploadMore, isSomeImageUploading } =
    useImageUpload({
      maxFiles: 1,
      maxFileSize: MAX_IMAGE_FILE_SIZE,
    });

  // Automatically send prompt when an image is selected and loaded
  useEffect(() => {
    if (uploadedImages.length > 0 && !isSomeImageUploading) {
      handleThemeGeneration({
        content: "", // No text prompt
        mentions: [], // No mentions
        images: [uploadedImages[0]],
      });
    }
  }, [uploadedImages, isSomeImageUploading]);

  const handleSetPrompt = async (prompt: string) => {
    const promptData = createCurrentThemePrompt({ prompt });
    handleThemeGeneration(promptData);
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
      <PillActionButton onClick={handleImageButtonClick} disabled={aiIsGenerating}>
        <input
          type="file"
          accept="image/*"
          multiple={false}
          ref={fileInputRef}
          onChange={handleImageUpload}
          disabled={aiIsGenerating}
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
