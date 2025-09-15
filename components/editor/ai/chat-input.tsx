"use client";

import { Loader } from "@/components/loader";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIChatForm } from "@/hooks/use-ai-chat-form";
import { useAIEnhancePrompt } from "@/hooks/use-ai-enhance-prompt";
import { useChatContext } from "@/hooks/use-chat-context";
import { useGuards } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import { ArrowUp, Loader as LoaderIcon, Plus, StopCircle } from "lucide-react";
import { AIChatFormBody } from "./ai-chat-form-body";
import { AlertBanner, BannerWrapper } from "./alert-banner";
import { EnhancePromptButton } from "./enhance-prompt-button";
import { ImageUploader } from "./image-uploader";

type ThemeGenerationPayload = {
  promptData: AIPromptData;
  options: {
    shouldClearLocalDraft?: boolean;
  };
};

interface ChatInputProps {
  onThemeGeneration: (promptData: AIPromptData) => Promise<void>;
  isGeneratingTheme: boolean;
  onCancelThemeGeneration: () => void;
}

export function ChatInput({
  onThemeGeneration,
  isGeneratingTheme,
  onCancelThemeGeneration,
}: ChatInputProps) {
  const { messages, startNewChat } = useChatContext();
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
    isInitializing,
  } = useAIChatForm();

  const handleNewChat = () => {
    startNewChat();
    clearLocalDraft();
    clearUploadedImages();
  };

  const { startEnhance, stopEnhance, enhancedPromptAsJsonContent, isEnhancingPrompt } =
    useAIEnhancePrompt();

  const handleEnhancePrompt = () => {
    // TODO: Add subscription check, this should be a Pro only feature
    if (!checkValidSession() || !checkValidSubscription()) return; // Act as an early return;

    // Only send images that are not loading, and strip loading property
    const images = uploadedImages.filter((img) => !img.loading).map(({ url }) => ({ url }));
    startEnhance({ ...promptData, images });
  };

  const generateTheme = async (payload: ThemeGenerationPayload) => {
    const { promptData, options } = payload;

    if (options.shouldClearLocalDraft) {
      clearLocalDraft();
      clearUploadedImages();
    }

    onThemeGeneration(promptData);
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
      <BannerWrapper show={isGeneratingTheme}>
        <div className="flex size-full items-center gap-1.5">
          <LoaderIcon className="size-2.5 animate-spin" />
          <Loader variant="text-shimmer" text="Generating..." size="sm" />
        </div>
      </BannerWrapper>

      <AlertBanner />
      <div className="bg-background relative isolate z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
        <AIChatFormBody
          isUserDragging={isUserDragging}
          disabled={isEnhancingPrompt}
          canSubmit={
            !isGeneratingTheme &&
            !isEnhancingPrompt &&
            !isEmptyPrompt &&
            !isSomeImageUploading &&
            !isInitializing
          }
          uploadedImages={uploadedImages}
          handleImagesUpload={handleImagesUpload}
          handleImageRemove={handleImageRemove}
          handleContentChange={handleContentChange}
          handleGenerate={handleGenerateSubmit}
          initialEditorContent={editorContentDraft ?? undefined}
          textareaKey={editorContentDraft ? "with-draft" : "no-draft"}
          externalEditorContent={isEnhancingPrompt ? enhancedPromptAsJsonContent : undefined}
        />
        <div className="@container/form flex items-center justify-between gap-2">
          <TooltipWrapper label="Create new chat" asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              disabled={
                isGeneratingTheme || isEnhancingPrompt || isInitializing || messages.length === 0
              }
              className="flex items-center gap-1.5 shadow-none"
            >
              <Plus />
              <span>New chat</span>
            </Button>
          </TooltipWrapper>

          <div className="flex items-center gap-2">
            {/* TODO: This should be a Pro only feature */}
            {promptData?.content ? (
              <EnhancePromptButton
                isEnhancing={isEnhancingPrompt}
                onStart={handleEnhancePrompt}
                onStop={stopEnhance}
                disabled={isGeneratingTheme || isInitializing}
              />
            ) : null}

            <ImageUploader
              fileInputRef={fileInputRef}
              onImagesUpload={handleImagesUpload}
              onClick={() => fileInputRef.current?.click()}
              disabled={
                isGeneratingTheme ||
                isEnhancingPrompt ||
                isInitializing ||
                uploadedImages.some((img) => img.loading) ||
                uploadedImages.length >= MAX_IMAGE_FILES
              }
            />

            {isGeneratingTheme ? (
              <TooltipWrapper label="Cancel generation" asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onCancelThemeGeneration}
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
                  disabled={
                    isEmptyPrompt ||
                    isSomeImageUploading ||
                    isGeneratingTheme ||
                    isEnhancingPrompt ||
                    isInitializing
                  }
                >
                  {isGeneratingTheme ? <LoaderIcon className="animate-spin" /> : <ArrowUp />}
                </Button>
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
