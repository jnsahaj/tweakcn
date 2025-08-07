import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/revola";
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
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} onlyDialog>
      <ResponsiveDialogContent className="overflow-hidden shadow-lg sm:max-w-100">
        <div className="space-y-6 p-6">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Share Theme</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Anyone with this URL will be able to view this theme.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={url}
              onClick={(e) => e.currentTarget.select()}
              className="selection:bg-primary selection:text-primary-foreground flex-1"
            />
            <Button size="icon" disabled={isCopying} onClick={handleCopy} variant="outline">
              {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
