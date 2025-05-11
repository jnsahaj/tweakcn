"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { usePreviewPanel } from "../hooks/use-preview-panel";

interface TogglePreviewPanelButtonProps extends React.ComponentProps<typeof Button> {}

export function TogglePreviewPanelButton({
  className,
  onClick,
  ...props
}: TogglePreviewPanelButtonProps) {
  const { isPreviewPanelOpen, togglePreviewPanel } = usePreviewPanel();

  const isMobile = useIsMobile();

  if (isMobile && !isPreviewPanelOpen) {
    return (
      <Button
        className={cn(className)}
        variant="ghost"
        size="icon"
        onClick={togglePreviewPanel}
        {...props}
      >
        <Eye />
      </Button>
    );
  }

  return (
    <Button
      className={cn(className)}
      variant="ghost"
      size="icon"
      onClick={togglePreviewPanel}
      {...props}
    >
      {!isPreviewPanelOpen ? <Eye /> : <EyeOff />}
    </Button>
  );
}
