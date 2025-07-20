import { useToast } from "@/components/ui/use-toast";
import { MAX_SVG_FILE_SIZE } from "@/lib/constants";
import { PromptImage } from "@/types/ai";
import {
  ALLOWED_IMAGE_TYPES,
  optimizeSvgContent,
  validateSvgContent,
} from "@/utils/ai/image-upload";
import { useRef } from "react";

export type PromptImageWithLoading = PromptImage & { loading: boolean };

export type ImageUploadAction =
  | { type: "ADD"; payload: { url: string; file: File }[] }
  | { type: "REMOVE"; payload: { index: number } }
  | { type: "REMOVE_BY_URL"; payload: { url: string } }
  | { type: "CLEAR" }
  | { type: "UPDATE_URL"; payload: { tempUrl: string; finalUrl: string } }
  | { type: "INITIALIZE"; payload: { url: string }[] };

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
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Unsupported file type",
          description: `"${file.name}" is not supported. Please use JPG, PNG, WebP, or SVG files.`,
        });
        return false;
      }

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

      const handleSuccess = (result: string) => {
        let finalUrl: string;

        if (file.type === "image/svg+xml") {
          try {
            const isValidSvg = validateSvgContent(result);
            if (!isValidSvg) {
              toast({
                title: "Potentially unsafe SVG",
                description: `"${file.name}" may contain unsafe content but will be processed anyway.`,
              });
            }

            const optimizedSvg = optimizeSvgContent(result);
            const encodedSvg = encodeURIComponent(optimizedSvg);

            if (encodedSvg.length > MAX_SVG_FILE_SIZE) {
              handleError();
              return;
            }

            finalUrl = `data:image/svg+xml,${encodedSvg}`;
          } catch (error) {
            handleError();
            return;
          }
        } else {
          finalUrl = result;
        }

        dispatch({ type: "UPDATE_URL", payload: { tempUrl, finalUrl } });
        URL.revokeObjectURL(tempUrl);
      };

      const handleError = () => {
        toast({
          title: "File read error",
          description: `Failed to read "${file.name}". Please try again.`,
        });

        dispatch({
          type: "REMOVE_BY_URL",
          payload: { url: tempUrl },
        });
        URL.revokeObjectURL(tempUrl);
      };

      reader.onload = (e) => {
        const result = e.target?.result;
        if (!result || typeof result !== "string") {
          handleError();
          return;
        }
        handleSuccess(result);
      };

      reader.onerror = handleError;
      reader.onabort = handleError;

      if (file.type === "image/svg+xml") {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
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
