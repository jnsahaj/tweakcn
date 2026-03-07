"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { DialogActionsProvider } from "@/hooks/use-dialog-actions";
import { useThemeInspector } from "@/hooks/use-theme-inspector";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { ThemeStyles } from "@/types/theme";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DropletIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import InspectorOverlay from "../editor/inspector-overlay";
import ThemeControlPanel from "../editor/theme-control-panel";
import { FloatingEditorHeader } from "./floating-editor-header";
import { PanelState, useFloatingEditor, type FloatingEditorOptions } from "./use-floating-editor";

/**
 * Panel size configurations
 * - collapsed: Header only (minimal view)
 * - normal: Default panel with content
 * - maximized: Full screen mode
 */
const PANEL_STYLES = {
  collapsed: "h-14 w-80",
  normal: "h-[600px] w-96",
  maximized: "inset-4 h-auto w-auto",
} as const;

const DRAGGABLE_ID = "floating-theme-editor";

/**
 * FloatingThemeEditor Component
 *
 * A floating, draggable theme editor that can be minimized, maximized, or closed.
 * Features:
 * - Smooth drag and drop positioning with dnd-kit
 * - Keyboard shortcut (Ctrl+Shift+P) to toggle
 * - Inspector mode to select and inspect elements
 * - Real-time theme customization
 *
 * @example
 * ```tsx
 * <FloatingThemeEditor defaultOpen={false} defaultPosition={{ x: 20, y: 20 }} />
 * ```
 */
export function FloatingThemeEditor(options: FloatingEditorOptions = {}) {
  const { isOpen, panelState, position, setPosition, toggleOpen, setPanelState } =
    useFloatingEditor(options);

  const themeState = useEditorStore((state) => state.themeState);
  const setThemeState = useEditorStore((state) => state.setThemeState);

  const { rootRef, inspector, inspectorEnabled, handleMouseMove, toggleInspector } =
    useThemeInspector();

  // Configure sensors for smooth dragging
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { delta } = event;
      setPosition((prev) => {
        const panelWidth = 384;
        const panelHeight = 600;
        const newX = prev.x + delta.x;
        const newY = prev.y + delta.y;
        const offset = 20;

        const minX = offset;
        const minY = offset;
        const maxX = window.innerWidth - panelWidth - offset;
        const maxY = window.innerHeight - panelHeight - offset;

        return {
          x: Math.max(minX, Math.min(newX, maxX)),
          y: Math.max(minY, Math.min(newY, maxY)),
        };
      });
    },
    [setPosition, panelState]
  );

  const handleStyleChange = useCallback(
    (newStyles: ThemeStyles) => {
      const prev = useEditorStore.getState().themeState;
      setThemeState({ ...prev, styles: newStyles });
    },
    [setThemeState]
  );

  // Set rootRef to document body for global inspection
  useEffect(() => {
    if (typeof document !== "undefined") {
      // @ts-expect-error - rootRef expects HTMLDivElement but body is HTMLBodyElement (compatible)
      rootRef.current = document.body;
    }
  }, [rootRef]);

  // Global mouse listener for inspector (inspect entire page except floating editor)
  useEffect(() => {
    if (!inspectorEnabled) return;

    const handleGlobalMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Ignore floating editor and its children
      if (target.closest("[data-floating-editor]")) return;

      // Ignore inspector overlay itself
      if (target.closest("[data-inspector-overlay]")) return;

      // Trigger inspection
      handleMouseMove(event as any);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    return () => document.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [inspectorEnabled, handleMouseMove]);

  // Keep panel within window boundaries on resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const panelWidth = 384;
        const panelHeight = 600;
        const offset = 20;

        const minX = offset;
        const minY = offset;
        const maxX = window.innerWidth - panelWidth - offset;
        const maxY = window.innerHeight - panelHeight - offset;

        return {
          x: Math.max(minX, Math.min(prev.x, maxX)),
          y: Math.max(minY, Math.min(prev.y, maxY)),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setPosition, panelState]);

  // Render toggle button when closed
  if (!isOpen) {
    return (
      <TooltipWrapper label="Open Theme Editor (Ctrl+Shift+P)" asChild>
        <Button
          onClick={() => toggleOpen(true)}
          className="fixed right-4 bottom-4 size-12 rounded-full shadow-lg"
          size="icon"
          aria-label="Open theme editor (Ctrl+Shift+P)"
        >
          <DropletIcon className="scale-125" />
        </Button>
      </TooltipWrapper>
    );
  }

  const isPanelMaximized = panelState === "maximized";
  const isPanelCollapsed = panelState === "collapsed";

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} id={DRAGGABLE_ID}>
        <DraggablePanel
          id={DRAGGABLE_ID}
          position={position}
          panelState={panelState}
          disabled={isPanelMaximized}
        >
          <FloatingEditorHeader
            panelState={panelState}
            inspectorEnabled={inspectorEnabled}
            onInspectorToggle={toggleInspector}
            onPanelStateChange={setPanelState}
            onClose={() => toggleOpen(false)}
          />

          {/* Show content only when not collapsed */}
          {!isPanelCollapsed && (
            <div className="flex min-h-0 flex-1 flex-col overflow-auto">
              <ThemeControlPanel
                styles={themeState.styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
                themePromise={Promise.resolve(null)}
              />
            </div>
          )}
        </DraggablePanel>
      </DndContext>

      {/* Inspector overlay for entire page */}
      <InspectorOverlay inspector={inspector} enabled={inspectorEnabled} rootRef={rootRef} />
    </>
  );
}

interface DraggablePanelProps {
  id: string;
  position: { x: number; y: number };
  panelState: PanelState;
  disabled: boolean;
  children: React.ReactNode;
}

function DraggablePanel({ id, position, panelState, disabled, children }: DraggablePanelProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  const commonStyles = {
    zIndex: 50,
  };

  const style = {
    ...commonStyles,
    ...(panelState !== "maximized" && {
      left: position.x,
      top: position.y,
      transform: CSS.Translate.toString(transform),
    }),
  };

  return (
    <DialogActionsProvider>
      <div
        ref={setNodeRef}
        className={cn(
          "bg-background fixed flex flex-col overflow-hidden rounded-lg border shadow-2xl",
          PANEL_STYLES[panelState]
        )}
        style={style}
        aria-label="Floating theme editor"
        data-floating-editor="true"
        {...attributes}
        {...listeners}
      >
        {children}
      </div>
    </DialogActionsProvider>
  );
}
