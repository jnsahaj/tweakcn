import { useToast } from "@/components/ui/use-toast";
import { PromptImage } from "@/types/ai";
import { useRef, useState } from "react";

export type PromptImageWithLoading = PromptImage & { loading: boolean };

interface UseImageUploadOptions {
  maxFiles: number;
  maxFileSize: number;
}

export function useImageUpload({ maxFiles, maxFileSize }: UseImageUploadOptions) {
  const [uploadedImages, setUploadedImages] = useState<PromptImageWithLoading[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagesUpload = (files: File[]) => {
    if (!files || files.length === 0) return;

    const totalImages = uploadedImages.length;
    let fileArray = files;

    if (totalImages + fileArray.length > maxFiles) {
      toast({
        title: "Image upload limit reached",
        description: `You can only upload up to ${maxFiles} images.`,
      });

      // Only allow up to the limit
      fileArray = fileArray.slice(0, maxFiles - totalImages);
      if (fileArray.length <= 0) return;
    }

    fileArray.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > maxFileSize) return;

      const uploadingImagePlaceholder: PromptImageWithLoading = {
        file,
        preview: "",
        loading: true,
      };
      setUploadedImages((prev) => [...prev, uploadingImagePlaceholder]);

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;

        setUploadedImages((prev) => {
          // Find the first image with this file and loading: true and update it
          const idx = prev.findIndex((img) => img.file === file && img.loading === true);
          if (idx === -1) return prev;
          const updated = [...prev];
          updated[idx] = { file, preview, loading: false };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input
  };

  const clearUploadedImages = () => {
    setUploadedImages([]);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input
  };

  const isSomeImageUploading = uploadedImages.some((img) => img.loading);
  const canUploadMore = uploadedImages.length < maxFiles && !isSomeImageUploading;

  return {
    fileInputRef,
    uploadedImages,
    handleImagesUpload,
    handleImageRemove,
    clearUploadedImages,
    canUploadMore,
    isSomeImageUploading,
  };
}
