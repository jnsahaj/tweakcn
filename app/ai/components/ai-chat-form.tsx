"use client";

import { AlertBanner } from "@/components/editor/ai/alert-banner";
import { ImageUploader } from "@/components/editor/ai/image-uploader";
import { UploadedImagePreview } from "@/components/editor/ai/uploaded-image-preview";
import ThemePresetSelect from "@/components/editor/theme-preset-select";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData, PromptImage } from "@/types/ai";
import { ArrowUp, Loader, StopCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

// TODO: Reconsider a better way to reuse the AI Form logic, it's basically a copy of the ChatInput component

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

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (newPromptData: AIPromptData) => {
    let image: PromptImage | undefined;
    if (selectedImage && imagePreview) {
      image = { file: selectedImage, preview: imagePreview };
    }

    setPromptData({ ...newPromptData, image });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    setImageLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      const imageData = { file, preview };
      setSelectedImage(file);
      setImagePreview(preview);
      setImageLoading(false);
      if (promptData) {
        setPromptData({ ...promptData, image: imageData });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (promptData) {
      const { image, ...rest } = promptData;
      setPromptData(rest as AIPromptData);
    }
  };

  const handleGenerate = async () => {
    if (!promptData?.content) return;
    handleThemeGeneration(promptData);
  };

  return (
    <div className="@container/form relative transition-all contain-layout">
      <AlertBanner />

      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col overflow-hidden rounded-lg border shadow-xs">
        {imagePreview && (
          <div
            className={cn(
              "relative flex items-center gap-2 px-2",
              aiGenerateLoading && "pointer-events-none opacity-75"
            )}
          >
            <HorizontalScrollArea className="w-full pt-1">
              <UploadedImagePreview
                imagePreview={imagePreview}
                handleImageRemove={handleImageRemove}
              />
            </HorizontalScrollArea>
          </div>
        )}

        <label className="sr-only">Chat Input</label>
        <div className={cn("min-h-[60px] p-2 pb-0", aiGenerateLoading && "pointer-events-none")}>
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

        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex w-full max-w-68 items-center gap-2 overflow-hidden">
            <ThemePresetSelect disabled={aiGenerateLoading} withCycleThemes={false} />
          </div>

          <div className="flex items-center gap-2">
            <ImageUploader
              fileInputRef={fileInputRef}
              handleImageSelect={handleImageSelect}
              aiGenerateLoading={aiGenerateLoading}
              onClick={() => fileInputRef.current?.click()}
              disabled={aiGenerateLoading || imageLoading || !!imagePreview} // TODO: handle disable state correctly
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
                disabled={!promptData?.content || aiGenerateLoading}
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
