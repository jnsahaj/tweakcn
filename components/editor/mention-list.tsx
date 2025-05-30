"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef } from "react";
import { cn } from "@/lib/utils";

// Define the structure of the theme item object
interface ThemeItem {
  id: string;
  label: string;
}

interface MentionListProps {
  items: ThemeItem[]; // Update items type to ThemeItem[]
  command: (item: { id: string; label: string }) => void; // Update command type if needed, here passing the whole object
}

// Use a type for the ref handle if needed, e.g., { onKeyDown: ... }
// Using `any` for now as in the original code
export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Function to select item (adapted from reference)
  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      // Pass the whole item object to the command function
      props.command(item);
    }
  };

  // Arrow key handlers using modulo (adapted from reference)
  const upHandler = () => {
    setSelectedIndex((prevIndex) => (prevIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  // Auto-scroll effect when selectedIndex changes
  useEffect(() => {
    if (selectedItemRef.current && containerRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        // Use modulo handlers
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        // Use modulo handlers
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        // Use enter handler
        enterHandler();
        return true;
      }

      if (event.key === "Tab") {
        // Use tab handler
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
        "scrollbar-thin max-h-[180px] overflow-y-auto"
      )}
    >
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            ref={index === selectedIndex ? selectedItemRef : null}
            // Use Tailwind classes mimicking shadcn/ui DropdownMenuItem with cn utility
            className={cn(
              "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground relative flex w-full items-center rounded-sm p-1.5 text-xs transition-colors outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              index === selectedIndex && "bg-accent text-accent-foreground"
            )}
            key={item.id} // Use item.id as the key
            onClick={(e) => {
              e.stopPropagation();
              selectItem(index);
            }}
          >
            {item.label}
          </button>
        ))
      ) : (
        <div
          className={cn(
            "text-muted-foreground relative flex cursor-default items-center rounded-sm p-1.5 text-xs select-none"
          )}
        >
          No result
        </div>
      )}
    </div>
  );
});

MentionList.displayName = "MentionList";
