import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface DragAndDropImageUploaderProps {
  onDrop: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export function DragAndDropImageUploader({
  onDrop,
  disabled,
  className,
}: DragAndDropImageUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    disabled,
    accept: { "image/*": [] },
  });

  return (
    <>
      <div className="absolute inset-0 z-10" {...getRootProps()} />

      <div
        className={cn(
          "relative flex size-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors",
          isDragActive ? "border-primary! bg-muted" : "bg-muted/40",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex w-full items-center justify-center gap-2">
          <Upload className="text-muted-foreground size-4" />
          <span className="text-muted-foreground text-sm font-medium">Drop images here</span>
        </div>
      </div>
    </>
  );
}
