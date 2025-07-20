import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { ComponentProps } from "react";

interface ChatImagePreviewProps extends ComponentProps<typeof Image> {
  name?: string;
}

export function ChatImagePreview({ name, src, className, alt, ...props }: ChatImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group/preview relative isolate size-full cursor-pointer overflow-hidden rounded-lg border">
          <Image
            width={250}
            height={250}
            src={src}
            className={cn(
              "h-auto max-h-[250px] w-auto max-w-[250px] object-cover object-center",
              className
            )}
            alt={alt || "Image preview"}
            title={name}
            {...props}
          />

          <div className="bg-accent/75 text-accent-foreground border-border/50! absolute right-2 bottom-2 z-1 flex items-center justify-end rounded-lg border p-1 opacity-0 backdrop-blur transition-opacity group-hover/preview:opacity-100">
            <ImageIcon className="size-3.5" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="size-fit max-h-[80vh] max-w-[80vw] overflow-hidden rounded-lg p-0">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
        </DialogHeader>
        <Image
          width={500}
          height={500}
          src={src}
          alt="Full image preview"
          className="h-auto max-h-[80vh] w-auto max-w-[80vw] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
