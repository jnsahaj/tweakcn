"use client";

import { useEditorStore } from "@/store/editor-store";
import { syncRoles } from "./roles";

let started = false;

/**
 * Keep Auto tokens in sync with roles after *every* editor state change (palette edits, role changes,
 * manual token edits, undo, presets…). `syncRoles` is idempotent, so the follow-up update settles in
 * one step, and it lands within tweakcn's 500 ms history window, so it never adds an undo step.
 */
export function startRoleSync() {
  if (started || typeof window === "undefined") return;
  started = true;
  // Dev-only handle for browser testing/debugging (never in production builds).
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as { __editorStore?: typeof useEditorStore }).__editorStore = useEditorStore;
  }
  useEditorStore.subscribe((state, prev) => {
    if (state.themeState === prev.themeState) return;
    const next = syncRoles(state.themeState);
    if (next !== state.themeState) state.setThemeState(next);
  });
}
