import { useToast } from "@/components/ui/use-toast";
import { PromptImage } from "@/types/ai";
import { useRef } from "react";

export type PromptImageWithLoading = PromptImage & { loading: boolean };

export type ImageUploadAction =
  | { type: "ADD"; payload: { url: string; file: File }[] }
  | { type: "REMOVE"; payload: { index: number } }
  | { type: "CLEAR" }
  | { type: "UPDATE_URL"; payload: { tempUrl: string; finalUrl: string } };

interface UseImageUploadOptions {
  maxFiles: number;
  maxFileSize: number;
  images: PromptImageWithLoading[];
  dispatch: (action: ImageUploadAction) => void;
}

export function useImageUpload({ maxFiles, maxFileSize, images, dispatch }: UseImageUploadOptions) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagesUpload = (files: File[]) => {
    if (!files || files.length === 0) return;

    let fileArray = Array.from(files);
    const totalImages = images.length;

    if (totalImages + fileArray.length > maxFiles) {
      toast({
        title: "Image upload limit reached",
        description: `You can only upload up to ${maxFiles} images.`,
      });
      fileArray = fileArray.slice(0, maxFiles - totalImages);
      if (fileArray.length <= 0) return;
    }

    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `Image "${file.name}" exceeds the ${maxFileSize / 1024 / 1024}MB size limit.`,
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const filesWithTempUrls = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    dispatch({ type: "ADD", payload: filesWithTempUrls });

    filesWithTempUrls.forEach(({ url: tempUrl, file }) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const finalUrl = e.target?.result as string;
        dispatch({ type: "UPDATE_URL", payload: { tempUrl, finalUrl } });
        URL.revokeObjectURL(tempUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = (index: number) => {
    dispatch({ type: "REMOVE", payload: { index } });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearUploadedImages = () => {
    dispatch({ type: "CLEAR" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isSomeImageUploading = images.some((img) => img.loading);
  const canUploadMore = images.length < maxFiles && !isSomeImageUploading;

  return {
    fileInputRef,
    handleImagesUpload,
    handleImageRemove,
    clearUploadedImages,
    canUploadMore,
    isSomeImageUploading,
  };
}
