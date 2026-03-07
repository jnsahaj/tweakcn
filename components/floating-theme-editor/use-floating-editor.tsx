"use client";
/**
 * Custom hook for managing floating theme editor state and interactions
 * Handles panel states, keyboard shortcuts, and position management
 * Dragging is handled by dnd-kit for smooth performance
 */

import { useCallback, useEffect, useState } from "react";

/**
 * Panel state types
 * - collapsed: Header only (minimal view)
 * - normal: Default panel with content
 * - maximized: Full screen mode
 */
export type PanelState = "collapsed" | "normal" | "maximized";

export interface FloatingEditorOptions {
  defaultOpen?: boolean;
  defaultPosition?: { x: number; y: number };
  onToggle?: (isOpen: boolean) => void;
}

const KEYBOARD_SHORTCUT = {
  key: "P",
  ctrl: true,
  shift: true,
} as const;

export function useFloatingEditor(options: FloatingEditorOptions = {}) {
  const { defaultOpen = false, defaultPosition = { x: 20, y: 20 }, onToggle } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [panelState, setPanelState] = useState<PanelState>("normal");
  const [position, setPosition] = useState(defaultPosition);

  // Toggle handler with callback
  const toggleOpen = useCallback(
    (value?: boolean) => {
      setIsOpen((prev) => {
        const newValue = value ?? !prev;
        onToggle?.(newValue);
        return newValue;
      });
    },
    [onToggle]
  );

  // Keyboard shortcut to toggle editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === KEYBOARD_SHORTCUT.key) {
        e.preventDefault();
        toggleOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleOpen]);

  return {
    isOpen,
    panelState,
    position,
    setPosition,
    toggleOpen,
    setPanelState,
  };
}
