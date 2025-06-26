import { create } from "zustand";

export type FocusColorId =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "accent"
  | "accent-foreground"
  | "muted"
  | "muted-foreground"
  | "destructive"
  | "destructive-foreground"
  | "border"
  | "input"
  | "ring"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "sidebar"
  | "sidebar-foreground"
  | "sidebar-primary"
  | "sidebar-primary-foreground"
  | "sidebar-accent"
  | "sidebar-accent-foreground"
  | "sidebar-border"
  | "sidebar-ring";

interface ColorRefEntry {
  ref: HTMLElement | null;
}

interface ColorControlFocusState {
  colorRefs: Map<FocusColorId, ColorRefEntry>;
  highlightTarget: FocusColorId | null;
  /**
   * Programmatically focus the color control identified by `name`.
   */
  focusColor: (name: FocusColorId) => void;
  registerColor: (name: FocusColorId, ref: HTMLElement | null) => void;
  unregisterColor: (name: FocusColorId) => void;
}

export const useColorControlFocusStore = create<ColorControlFocusState>((set, get) => ({
  colorRefs: new Map(),
  highlightTarget: null,

  registerColor: (name, ref) =>
    set((state) => {
      const map = new Map(state.colorRefs);
      map.set(name, { ref });
      return { colorRefs: map };
    }),

  unregisterColor: (name) =>
    set((state) => {
      const map = new Map(state.colorRefs);
      map.delete(name);
      return { colorRefs: map };
    }),

  focusColor: (name) => {
    const { colorRefs } = get();
    const entry = colorRefs.get(name);
    if (!entry) return;

    // Scroll & highlight after a brief delay to ensure expansion has occurred.
    setTimeout(() => {
      if (entry.ref?.scrollIntoView) {
        entry.ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      set({ highlightTarget: name });
      setTimeout(() => set({ highlightTarget: null }), 3000);
    }, 175);
  },
}));

/**
 * Hook that exposes helper functions for color control focus behaviour.
 */
export const useColorControlFocus = () => {
  return {
    registerColor: useColorControlFocusStore((s) => s.registerColor),
    unregisterColor: useColorControlFocusStore((s) => s.unregisterColor),
    highlightTarget: useColorControlFocusStore((s) => s.highlightTarget),
    focusColor: useColorControlFocusStore((s) => s.focusColor),
  } as const;
};
