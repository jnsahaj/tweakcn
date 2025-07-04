import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePlus } from "lucide-react";
import { ComponentProps } from "react";

interface ImageUploaderProps extends ComponentProps<typeof Button> {}

export function ImageUploader({ disabled, className, ...props }: ImageUploaderProps) {
  return (
    <TooltipWrapper label="Attach image" asChild>
      <Button
        variant="outline"
        size="sm"
        className={cn("flex items-center gap-1.5 shadow-none", "@max-[350px]/form:w-8", className)}
        disabled={disabled}
        {...props}
      >
        <ImagePlus /> <span className="hidden @[350px]/form:inline-flex">Image</span>
      </Button>
    </TooltipWrapper>
  );
}
