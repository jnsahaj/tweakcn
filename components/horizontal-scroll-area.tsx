"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useScrollStartEnd } from "@/hooks/use-scroll-start-end";
import { cn } from "@/lib/utils";

interface HorizontalScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {}

export function HorizontalScrollArea({ className, children, ...props }: HorizontalScrollAreaProps) {
  const { isScrollStart, isScrollEnd, scrollStartRef, scrollEndRef } = useScrollStartEnd();

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "from-background/75 pointer-events-none absolute right-0 left-0 z-10 h-full bg-gradient-to-r to-transparent to-10% opacity-0 transition-opacity",
          isScrollStart ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "from-background/75 pointer-events-none absolute right-0 left-0 z-10 h-full bg-gradient-to-l to-transparent to-10% opacity-0 transition-opacity",
          isScrollEnd ? "opacity-0" : "opacity-100"
        )}
      />

      <ScrollArea {...props}>
        <div
          className={cn("relative flex w-fit flex-row items-center justify-start gap-2", className)}
        >
          <div ref={scrollStartRef} className="absolute inset-y-0 left-px" />
          {children}
          <div ref={scrollEndRef} className="absolute inset-y-0 right-px" />
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
}
