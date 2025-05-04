import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
}

export function ShareDialog({ open, onOpenChange, url }: ShareDialogProps) {
  const { isCopying, hasCopied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = async () => {
    await copyToClipboard(url, {
      title: "Theme URL copied to clipboard!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 py-6 overflow-hidden rounded-lg border shadow-lg gap-6">
        <DialogHeader className="px-6">
          <DialogTitle>Share Theme</DialogTitle>
          <DialogDescription>
            Anyone with this URL will be able to view this theme.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 px-6">
          <Input
            readOnly
            value={url}
            className="flex-1"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            size="icon"
            disabled={isCopying}
            onClick={handleCopy}
            variant="outline"
          >
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
