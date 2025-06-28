"use client";

import { Loading } from "@/components/loading";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { AIPromptData } from "@/types/ai";
import { ArrowUp, ImageIcon, Loader, Plus, StopCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading: aiGenerateLoading, cancelThemeGeneration } = useAIThemeGeneration();
  const { messages, clearMessages } = useAIChatStore();

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleContentChange = (newPromptData: AIPromptData) => {
    setPromptData({
      ...newPromptData,
      image: selectedImage && imagePreview ? { file: selectedImage, preview: imagePreview } : undefined,
    });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
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
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (promptData) {
      const { image, ...rest } = promptData;
      setPromptData(rest as AIPromptData);
    }
  };

  const handleGenerate = async () => {
    if (!promptData?.content) return;
    handleThemeGeneration(promptData);
    handleImageRemove();
  };

  return (
    <div className="@container/form relative transition-all">
      <div className="bg-background relative z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border shadow-xs">
        <label className="sr-only">Chat Input</label>
        <div className="min-h-[60px] p-2 pb-0">
          <div className="bg-muted/40 relative isolate rounded-lg">
            <CustomTextarea
              onContentChange={handleContentChange}
              onGenerate={handleGenerate}
              key={messages.length}
              characterLimit={AI_PROMPT_CHARACTER_LIMIT}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <TooltipWrapper label="Create new chat" asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={aiGenerateLoading || messages.length === 0}
              className="shadow-none"
            >
              <Plus />
              <span>New chat</span>
            </Button>
          </TooltipWrapper>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={aiGenerateLoading}
              aria-label="Upload image for theme generation"
            />
            {imagePreview ? (
              <div className="relative">
                {imageLoading ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-muted rounded border"><Loader className="animate-spin w-4 h-4" /></div>
                ) : (
                  <img src={imagePreview} alt="Preview" className="w-8 h-8 rounded object-cover border" />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                  onClick={handleImageRemove}
                  disabled={aiGenerateLoading}
                >
                  <X className="w-2 h-2" />
                </Button>
              </div>
            ) : (
              <TooltipWrapper label="Add image" asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={aiGenerateLoading}
                  className="shadow-none"
                >
                  <ImageIcon />
                  <span className="hidden @[400px]/form:inline-flex">Image</span>
                </Button>
              </TooltipWrapper>
            )}
            {aiGenerateLoading ? (
              <TooltipWrapper label="Cancel generation" asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={cancelThemeGeneration}
                  className={cn("flex items-center gap-1 shadow-none", "@max-[350px]/form:w-8")}
                >
                  <StopCircle />
                  <span className="hidden @[350px]/form:inline-flex">Stop</span>
                </Button>
              </TooltipWrapper>
            ) : (
              <TooltipWrapper label="Send message" asChild>
                <Button
                  size="icon"
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
