"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Loader, X } from "lucide-react";
import Image from "next/image";

interface ImagePreviewProps {
  imagePreview: string;
  isImageLoading: boolean;
  handleImageRemove: () => void;
}

export function UploadedImagePreview({
  imagePreview,
  isImageLoading,
  handleImageRemove,
}: ImagePreviewProps) {
  if (isImageLoading) {
    return (
      <div className="bg-muted inset-0 flex size-14 items-center justify-center">
        <Loader className="text-muted-foreground size-4 animate-spin" />
      </div>
    );
  }

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "group/preview animate-in fade-in-0 relative size-14 shrink-0 rounded-md border p-0.5 transition-all",
            "hover:bg-accent"
          )}
        >
          <Image
            width={40}
            height={40}
            src={imagePreview}
            alt="Image preview"
            className="size-full rounded-sm object-cover"
          />

          <TooltipWrapper label="Remove image" asChild>
            <Button
              variant="destructive"
              size="icon"
              className={cn("absolute top-1 right-1 size-4 rounded-full transition-all")}
              onClick={handleImageRemove}
            >
              <X className="size-3!" />
            </Button>
          </TooltipWrapper>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="size-fit overflow-hidden p-0" align="start" side="top">
        <div className="size-full overflow-hidden">
          <Image
            width={300}
            height={300}
            src={imagePreview}
            alt="Image preview"
            className="h-auto max-h-[300px] w-auto max-w-[300px] object-contain"
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
