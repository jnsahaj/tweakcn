"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { useClassNames } from "@/hooks/use-theme-inspector-classnames";
import { cn } from "@/lib/utils";
import { Inspect } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import InspectorClassItem from "./inspector-class-item";

interface InspectorState {
  rect: DOMRect | null;
  className: string;
}

interface InspectorOverlayProps {
  inspector: InspectorState;
  enabled: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
}

const InspectorOverlay = ({ inspector, enabled, rootRef }: InspectorOverlayProps) => {
  const classNames = useClassNames(inspector.className);

  if (!enabled || !inspector.rect || typeof window === "undefined" || !rootRef.current) {
    return null;
  }

  // Get the container's bounding rect to convert from viewport coordinates to container-relative coordinates
  const containerRect = rootRef.current.getBoundingClientRect();
  const relativeRect = {
    top: inspector.rect.top - containerRect.top,
    left: inspector.rect.left - containerRect.left,
    width: inspector.rect.width,
    height: inspector.rect.height,
  };

  return createPortal(
    <HoverCard open={true} defaultOpen={false}>
      <HoverCardTrigger asChild>
        <div
          data-inspector-overlay
          className={cn(
            "ring-primary ring-offset-background/90 pointer-events-none absolute z-50 ring-3 ring-offset-2",
            "transition-all duration-100 ease-in-out"
          )}
          style={{
            top: relativeRect.top,
            left: relativeRect.left,
            width: relativeRect.width,
            height: relativeRect.height,
          }}
        />
      </HoverCardTrigger>

      <HoverCardContent
        data-inspector-overlay
        side="top"
        align="start"
        className={cn(
          "bg-popover/85 text-popover-foreground pointer-events-auto relative w-auto max-w-[50vw] rounded-lg border p-0 shadow-xl backdrop-blur-lg"
        )}
        sideOffset={8}
      >
        <div className="text-muted-foreground flex items-center gap-1.5 px-2 pt-2 text-sm">
          <Inspect className="size-4" />
          Inspector
        </div>
        <Separator className="my-1" />
        <div className="flex flex-col gap-1 px-1 pb-2">
          {classNames.map((cls) => (
            <InspectorClassItem key={cls} className={cls} />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>,
    rootRef.current
  );
};

const arePropsEqual = (
  prevProps: InspectorOverlayProps,
  nextProps: InspectorOverlayProps
): boolean => {
  if (prevProps.enabled !== nextProps.enabled) return false;
  if (prevProps.rootRef !== nextProps.rootRef) return false;

  const prevRect = prevProps.inspector.rect;
  const nextRect = nextProps.inspector.rect;

  if (!prevRect && !nextRect)
    return prevProps.inspector.className === nextProps.inspector.className;
  if (!prevRect || !nextRect) return false;

  return (
    prevRect.top === nextRect.top &&
    prevRect.left === nextRect.left &&
    prevRect.width === nextRect.width &&
    prevRect.height === nextRect.height &&
    prevProps.inspector.className === nextProps.inspector.className
  );
};

export default React.memo(InspectorOverlay, arePropsEqual);
