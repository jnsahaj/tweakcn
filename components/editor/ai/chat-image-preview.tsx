import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export function ChatImagePreview({ imageSrc }: { imageSrc: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group/preview relative isolate cursor-pointer self-end overflow-hidden rounded-lg border">
          <Image
            width={300}
            height={300}
            src={imageSrc}
            alt="Image preview"
            className="h-auto max-h-[300px] w-auto max-w-[300px] rounded-lg object-contain"
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
          src={imageSrc}
          alt="Full image preview"
          className="h-auto max-h-[80vh] w-auto max-w-[80vw] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
