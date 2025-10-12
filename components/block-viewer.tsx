"use client";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import React from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

import { ComponentErrorBoundary } from "@/components/error-boundary";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type BlockViewerContext = {
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null>;
  toggleValue: string;
  setToggleValue: (value: string) => void;
};

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null);

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext);
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider.");
  }
  return context;
}

function BlockViewerProvider({ children }: { children: React.ReactNode }) {
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);
  const [toggleValue, setToggleValue] = React.useState("100");

  return (
    <BlockViewerContext.Provider
      value={{
        resizablePanelRef,
        toggleValue,
        setToggleValue,
      }}
    >
      {children}
    </BlockViewerContext.Provider>
  );
}

export function BlockViewer({
  className,
  name,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
}) {
  return (
    <BlockViewerProvider>
      <div
        data-slot="block-viewer"
        className={cn(
          "group/block-viewer bg-background @container isolate flex size-full min-w-0 flex-col overflow-clip",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </BlockViewerProvider>
  );
}

export function BlockViewerToolbar({
  name,
  className,
  toolbarControls,
}: React.ComponentProps<"div"> & {
  name: string;
  className?: string;
  toolbarControls?: React.ReactNode;
}) {
  const { resizablePanelRef, toggleValue, setToggleValue } = useBlockViewer();

  return (
    <div data-slot="block-viewer-toolbar" className={cn("h-12 w-full border-b p-2", className)}>
      <div className="flex size-full items-center justify-between gap-4">
        <div className="flex-1">
          {!!toolbarControls ? (
            toolbarControls
          ) : (
            <span className="text-sm font-medium capitalize">{name}</span>
          )}
        </div>

        <div className="hidden items-center justify-between lg:group-has-data-[slot=block-viewer-display]/block-viewer:flex">
          <ToggleGroup
            className="bg-background flex gap-0.5 rounded-lg border p-0.5"
            type="single"
            value={toggleValue}
            onValueChange={(value) => {
              if (value && resizablePanelRef?.current) {
                resizablePanelRef.current.resize(parseInt(value));
                setToggleValue(value);
              }
            }}
          >
            <ToggleGroupItem value="100" className="flex size-7 items-center justify-center p-1">
              <Monitor className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem value="60" className="flex size-7 items-center justify-center p-1">
              <Tablet className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem value="30" className="flex size-7 items-center justify-center p-1">
              <Smartphone className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}

export function BlockViewerDisplay({
  name,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
}) {
  const { resizablePanelRef, setToggleValue } = useBlockViewer();

  // Auto-resize to full width when screen goes under lg breakpoint (1024px)
  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const resizePanel = () => {
      if (window.innerWidth < 1024 && resizablePanelRef?.current) {
        resizablePanelRef.current.resize(100);
        setToggleValue("100");
      }
    };

    resizePanel();
    mql.addEventListener("change", resizePanel);
    return () => mql.removeEventListener("change", resizePanel);
  }, [resizablePanelRef, setToggleValue]);

  return (
    <ComponentErrorBoundary name={name}>
      <div
        id={name}
        data-slot="block-viewer-display"
        data-name={name.toLowerCase()}
        className={cn("size-full min-h-0 gap-4 overflow-hidden", className)}
        {...props}
      >
        <ResizablePanelGroup direction="horizontal" className="relative isolate z-10 size-full">
          <div className="bg-muted absolute inset-0 right-3 [background-image:radial-gradient(var(--muted-foreground),transparent_1px)] [background-size:1rem_1rem] opacity-60 dark:opacity-35" />

          <ResizablePanel
            ref={resizablePanelRef}
            className="bg-background relative min-w-[350px] lg:aspect-auto"
            defaultSize={100}
            minSize={30}
          >
            {children}
          </ResizablePanel>

          <ResizableHandle className="after:bg-border relative inset-x-0 mx-auto hidden w-3 border-l bg-transparent after:absolute after:top-1/2 after:h-8 after:w-[4px] after:-translate-y-1/2 after:rounded-full after:transition-all hover:after:h-12 active:after:h-12 lg:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </ComponentErrorBoundary>
  );
}
