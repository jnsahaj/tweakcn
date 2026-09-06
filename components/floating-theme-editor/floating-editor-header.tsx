"use client";
/**
 * Header component for the floating theme editor
 * Contains controls for inspector, minimize/maximize, and close
 */

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Inspect,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { PanelState } from "./use-floating-editor";

interface FloatingEditorHeaderProps {
  panelState: PanelState;
  inspectorEnabled: boolean;
  onInspectorToggle: () => void;
  onPanelStateChange: (state: PanelState) => void;
  onClose: () => void;
}

export function FloatingEditorHeader({
  panelState,
  inspectorEnabled,
  onInspectorToggle,
  onPanelStateChange,
  onClose,
}: FloatingEditorHeaderProps) {
  const isDraggable = panelState !== "maximized";
  const isCollapsed = panelState === "collapsed";

  return (
    <div
      className="bg-muted/30 flex h-14 items-center justify-between border-b px-3"
      onMouseDown={(e) => {
        isDraggable
          ? (e.currentTarget.style.cursor = "grabbing")
          : (e.currentTarget.style.cursor = "default");
      }}
      onMouseUp={(e) => {
        isDraggable
          ? (e.currentTarget.style.cursor = "grab")
          : (e.currentTarget.style.cursor = "default");
      }}
    >
      <div className="flex items-center gap-2">
        {isDraggable && (
          <GripVertical
            className="size-5 cursor-move"
            onMouseDown={(e) => {
              isDraggable
                ? (e.currentTarget.style.cursor = "grabbing")
                : (e.currentTarget.style.cursor = "default");
            }}
            onMouseUp={(e) => {
              isDraggable
                ? (e.currentTarget.style.cursor = "grab")
                : (e.currentTarget.style.cursor = "default");
            }}
          />
        )}
        <span className="font-semibold">Theme Editor</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Inspector toggle button */}
        <TooltipWrapper label="Toggle Inspector" asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInspectorToggle}
            className={cn(
              "group size-8",
              inspectorEnabled && "bg-accent text-accent-foreground w-auto"
            )}
          >
            <Inspect className="size-4 transition-all group-hover:scale-120" />
            {inspectorEnabled && <span className="text-xs tracking-wide uppercase">on</span>}
          </Button>
        </TooltipWrapper>

        {/* Collapse button - shows when panel is normal or maximized */}
        {panelState !== "collapsed" && (
          <TooltipWrapper label="Collapse" asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPanelStateChange("collapsed")}
              className="group size-8"
            >
              <ChevronDown className="size-4 transition-all group-hover:scale-120" />
            </Button>
          </TooltipWrapper>
        )}

        {/* Expand button - shows when panel is collapsed */}
        {panelState === "collapsed" && (
          <TooltipWrapper label="Expand" asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPanelStateChange("normal")}
              className="group size-8"
            >
              <ChevronUp className="size-4 transition-all group-hover:scale-120" />
            </Button>
          </TooltipWrapper>
        )}

        {/* Maximize/Restore button - shows when not collapsed */}
        {panelState !== "collapsed" && (
          <TooltipWrapper label={panelState === "maximized" ? "Restore" : "Maximize"} asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onPanelStateChange(panelState === "maximized" ? "normal" : "maximized")
              }
              className="group size-8"
            >
              {panelState === "maximized" ? (
                <Minimize2 className="size-4 transition-all group-hover:scale-120" />
              ) : (
                <Maximize2 className="size-4 transition-all group-hover:scale-120" />
              )}
            </Button>
          </TooltipWrapper>
        )}

        {/* Close button*/}
        <TooltipWrapper label="Close (Ctrl+Shift+P)" asChild>
          <Button variant="ghost" size="sm" onClick={onClose} className="group size-8">
            <X className="size-4 transition-all group-hover:scale-120" />
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
}
