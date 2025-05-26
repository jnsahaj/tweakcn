"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { Copy, CopyCheck } from "lucide-react";
import { ComponentProps } from "react";
import { TooltipWrapper } from "./tooltip-wrapper";
import { Button } from "./ui/button";

interface CopyButtonProps extends ComponentProps<typeof Button> {
  textToCopy: string;
  successMessage?: {
    title?: string;
    description?: string;
  };
}

export function CopyButton({ textToCopy, successMessage, className, ...props }: CopyButtonProps) {
  const { copyToClipboard, hasCopied } = useCopyToClipboard();

  return (
    <TooltipWrapper label="Copy" asChild>
      <Button
        size="icon"
        variant="ghost"
        className={cn("size-6 [&>svg]:size-3.5", className)}
        onClick={() => copyToClipboard(textToCopy, successMessage)}
        {...props}
      >
        {hasCopied ? <CopyCheck /> : <Copy />}
        <span className="sr-only">Copy</span>
      </Button>
    </TooltipWrapper>
  );
}
