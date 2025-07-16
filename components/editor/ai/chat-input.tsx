"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIChatForm } from "@/hooks/use-ai-chat-form";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { useGuards } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAIChatStore } from "@/store/ai-chat-store";
import { AIPromptData } from "@/types/ai";
import { ArrowUp, Loader, Plus, StopCircle } from "lucide-react";
import { AIChatFormBody } from "./ai-chat-form-body";
import { AlertBanner } from "./alert-banner";
import { ImageUploader } from "./image-uploader";
type ThemeGenerationPayload = {
  promptData: AIPromptData | null;
  options: {
    shouldClearLocalDraft?: boolean;
  };
};

export function ChatInput({
  onGenerateTheme,
}: {
  onGenerateTheme: (promptData: AIPromptData | null) => Promise<void>;
}) {
  const { messages, clearMessages } = useAIChatStore();
  const { loading: aiGenerateLoading, cancelThemeGeneration } = useAIThemeGenerationCore();
  const { checkValidSession, checkValidSubscription } = useGuards();

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
    clearUploadedImages,
    isSomeImageUploading,
    isUserDragging,
  } = useAIChatForm();

  const handleNewChat = () => {
    clearMessages();
    clearLocalDraft();
    clearUploadedImages();
  };

  const generateTheme = async (payload: ThemeGenerationPayload) => {
    const { promptData, options } = payload;

    if (options.shouldClearLocalDraft) {
      clearLocalDraft();
      clearUploadedImages();
    }

    onGenerateTheme(promptData);
  };

  const handleGenerateSubmit = async () => {
    // Only send images that are not loading, and strip loading property
    const images = uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url }));

    // Proceed only if there is text, or at least one image
    if (isEmptyPrompt && images.length === 0) return;

    const payload: ThemeGenerationPayload = {
      promptData: {
        ...promptData,
        images,
      },
      options: {
        shouldClearLocalDraft: true,
      },
    };

    if (!checkValidSession("signup", "AI_GENERATE_FROM_CHAT", payload)) return;
    if (!checkValidSubscription()) return;

    generateTheme(payload);
  };

  usePostLoginAction("AI_GENERATE_FROM_CHAT", (payload) => {
    generateTheme(payload);
  });

  return (
    <div className="relative transition-all contain-layout">
      <AlertBanner />
      <div className="bg-background relative isolate z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
        <AIChatFormBody
          isUserDragging={isUserDragging}
          aiGenerateLoading={aiGenerateLoading}
          uploadedImages={uploadedImages}
          handleImagesUpload={handleImagesUpload}
          handleImageRemove={handleImageRemove}
          handleContentChange={handleContentChange}
          handleGenerate={handleGenerateSubmit}
          initialEditorContent={editorContentDraft ?? undefined}
          textareaKey={editorContentDraft ? "with-draft" : "no-draft"}
        />
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
                  onClick={handleGenerateSubmit}
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
