import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImagePlus } from "lucide-react";
import { ComponentProps } from "react";

interface ImageUploaderProps extends ComponentProps<typeof Button> {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImagesUpload: (files: File[]) => void;
}

export function ImageUploader({
  fileInputRef,
  onImagesUpload,
  disabled,
  className,
  ...props
}: ImageUploaderProps) {
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);
    onImagesUpload(files);
  };

  return (
    <>
      <input
        type="file"
        multiple
        max={MAX_IMAGE_FILES}
        size={MAX_IMAGE_FILE_SIZE}
        accept="image/*"
        className="hidden"
        aria-label="Upload image for theme generation"
        ref={fileInputRef}
        onChange={handleImagesUpload}
        disabled={disabled}
      />
      <TooltipWrapper label="Attach image" asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-1.5 shadow-none",
            "@max-[350px]/form:w-8",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <ImagePlus /> <span className="hidden @[350px]/form:inline-flex">Image</span>
        </Button>
      </TooltipWrapper>
    </>
  );
}
