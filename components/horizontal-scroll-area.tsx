"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

interface HorizontalScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollArea> {}

export function HorizontalScrollArea({ className, children, ...props }: HorizontalScrollAreaProps) {
  const id = useId();
  const leftMarkerRef = useRef<HTMLDivElement>(null);
  const rightMarkerRef = useRef<HTMLDivElement>(null);
  const [isScrollLeft, setIsScrollLeft] = useState(true);
  const [isScrollRight, setIsScrollRight] = useState(false);

  useEffect(() => {
    const leftMarker = leftMarkerRef.current;
    const rightMarker = rightMarkerRef.current;

    if (!leftMarker || !rightMarker) return;

    const observerOptions = {
      root: document.getElementById(id),
      threshold: 0,
    };

    const leftObserver = new IntersectionObserver(([entry]) => {
      setIsScrollLeft(entry.isIntersecting);
    }, observerOptions);

    const rightObserver = new IntersectionObserver(([entry]) => {
      setIsScrollRight(entry.isIntersecting);
    }, observerOptions);

    leftObserver.observe(leftMarker);
    rightObserver.observe(rightMarker);

    return () => {
      leftObserver.disconnect();
      rightObserver.disconnect();
    };
  }, [id]);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "from-background/75 pointer-events-none absolute right-0 left-0 z-10 h-full bg-gradient-to-r to-transparent to-10% opacity-0 transition-opacity",
          isScrollLeft ? "opacity-0" : "opacity-100"
        )}
      />
      <div
        className={cn(
          "from-background/75 pointer-events-none absolute right-0 left-0 z-10 h-full bg-gradient-to-l to-transparent to-10% opacity-0 transition-opacity",
          isScrollRight ? "opacity-0" : "opacity-100"
        )}
      />

      <ScrollArea id={id} {...props}>
        <div
          className={cn("relative flex w-fit flex-row items-center justify-start gap-2", className)}
        >
          {/* Left intersection marker */}
          <div ref={leftMarkerRef} className="absolute inset-y-0 left-0 w-1.5" />
          {children}
          {/* Right intersection marker */}
          <div ref={rightMarkerRef} className="absolute inset-y-0 right-0 w-1.5" />
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
}
