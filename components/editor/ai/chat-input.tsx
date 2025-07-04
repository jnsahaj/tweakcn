"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { Loading } from "@/components/loading";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { AIPromptData, PromptImage } from "@/types/ai";
import { ArrowUp, Loader, Plus, StopCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AlertBanner } from "./alert-banner";
import { ImageUploader } from "./image-uploader";
import { UploadedImagePreview } from "./uploaded-image-preview";

const CustomTextarea = dynamic(() => import("@/components/editor/custom-textarea"), {
  ssr: false,
  loading: () => <Loading className="min-h-[60px] w-full rounded-lg" />,
});

export function ChatInput({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (promptData: AIPromptData | null) => void;
}) {
  const [promptData, setPromptData] = useState<AIPromptData | null>(null);
  const { loading: aiGenerateLoading, cancelThemeGeneration } = useAIThemeGeneration();

  const { messages, clearMessages } = useAIChatStore();

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

    // Remove the image after generation
    handleImageRemove();
  };

  return (
    <div className="relative transition-all contain-layout">
      <AlertBanner />

      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border py-2 shadow-xs">
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

        <div className="min-h-[60px] px-2">
          <label className="sr-only">Chat Input</label>
          <div className="bg-muted/40 relative isolate rounded-lg">
            <CustomTextarea
              onContentChange={handleContentChange}
              onGenerate={handleGenerate}
              key={messages.length}
              characterLimit={AI_PROMPT_CHARACTER_LIMIT}
            />
          </div>
        </div>

        <div className="@container/form flex items-center justify-between gap-2 px-2">
          <TooltipWrapper label="Create new chat" asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
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
              handleImageSelect={handleImageSelect}
              aiGenerateLoading={aiGenerateLoading}
              onClick={() => fileInputRef.current?.click()}
              disabled={aiGenerateLoading || imageLoading || !!imagePreview} // TODO: handle disable state correctly
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
                  disabled={!promptData?.content || aiGenerateLoading}
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
