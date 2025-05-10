"use client";

import ThemePreviewPanel from "@/components/editor/theme-preview-panel";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { ChevronsLeft, ChevronsRight, ChevronsUp } from "lucide-react";

export function PreviewPanel() {
  const { themeState } = useEditorStore();
  const { theme: mode } = useTheme();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <ThemePreviewPanel styles={themeState.styles} currentMode={mode} />
      </div>
    </div>
  );
}

interface TogglePreviewPanelButtonProps extends React.ComponentProps<typeof Button> {
  isOpen: boolean;
  handleTogglePreviewPanel: () => void;
}

export function TogglePreviewPanelButton({
  isOpen,
  handleTogglePreviewPanel,
  className,
  onClick,
  ...props
}: TogglePreviewPanelButtonProps) {
  const isMobile = useIsMobile();

  if (isMobile && !isOpen) {
    return (
      <Button
        className={cn(className)}
        variant="ghost"
        size="icon"
        onClick={handleTogglePreviewPanel}
        {...props}
      >
        <ChevronsUp />
      </Button>
    );
  }

  return (
    <Button
      className={cn(className)}
      variant="ghost"
      size="icon"
      onClick={handleTogglePreviewPanel}
      {...props}
    >
      {!isOpen ? <ChevronsLeft /> : <ChevronsRight />}
    </Button>
  );
}
