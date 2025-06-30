"use client";

import React, { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import { FocusColorId, useColorControlFocus } from "@/store/color-control-focus-store";
import { segmentClassName } from "@/lib/inspector/segment-classname";
import { useEditorStore } from "@/store/editor-store";

interface InspectorClassItemProps {
  className: string;
}

const InspectorClassItem = memo(({ className }: InspectorClassItemProps) => {
  const { focusColor } = useColorControlFocus();
  const { themeState } = useEditorStore();
  const styles = themeState.styles[themeState.currentMode];
  const segments = useMemo(() => segmentClassName(className), [className]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const color = segments.value;
      if (color) {
        focusColor(color as FocusColorId);
      }
    },
    [segments.value, focusColor]
  );

  const renderSegmentedClassName = useCallback((): React.ReactNode => {
    const parts = [];

    if (segments.selector) {
      parts.push(
        <span key="selector" className="text-foreground/60">
          {segments.selector}:
        </span>
      );
    }

    if (segments.prefix) {
      parts.push(
        <span key="prefix" className="text-foreground">
          {segments.prefix}
        </span>
      );
    }

    if (segments.value) {
      parts.push(
        <span key="dash" className="text-foreground/80">
          -
        </span>,
        <span key="value" className="text-foreground font-bold">
          {segments.value}
        </span>
      );
    }

    if (segments.opacity) {
      parts.push(
        <span key="slash" className="text-foreground/60">
          /
        </span>,
        <span key="opacity" className="text-foreground/60">
          {segments.opacity}
        </span>
      );
    }

    return <>{parts}</>;
  }, [segments]);

  return (
    <div
      className="group hover:bg-foreground/10 flex cursor-pointer items-center justify-between gap-2 rounded-md p-1.5 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center gap-1.5">
        <span
          style={{
            backgroundColor: styles[segments.value as keyof typeof styles],
          }}
          className={cn(
            "border-foreground ring-border block size-4 shrink-0 rounded-md border-1 ring-1"
          )}
        />
        <span className="font-mono text-xs">{renderSegmentedClassName()}</span>
      </div>
      <SquarePen className="text-muted-foreground size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
});

InspectorClassItem.displayName = "InspectorClassItem";

export default InspectorClassItem;
