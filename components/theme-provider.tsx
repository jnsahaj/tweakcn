"use client";

import { createContext, useContext, useEffect } from "react";
import { useEditorStore } from "../store/editor-store";
import { applyThemeToElement } from "@/utils/apply-theme";
import { useThemePresetFromUrl } from "@/hooks/use-theme-preset-from-url";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type Coords = { x: number; y: number };

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (coords?: Coords) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { themeState, setThemeState } = useEditorStore();

  // Handle theme preset from URL
  useThemePresetFromUrl();

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    applyThemeToElement(themeState, root);
  }, [themeState]);

  const handleThemeChange = (newMode: Theme) => {
    setThemeState({ ...themeState, currentMode: newMode });
  };

  const handleThemeToggle = (coords?: Coords) => {
    const root = document.documentElement;
    const newMode = themeState.currentMode === "light" ? "dark" : "light";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      handleThemeChange(newMode);
      return;
    }

    if (coords) {
      root.style.setProperty("--x", `${(coords.x / window.innerWidth) * 100}%`);
      root.style.setProperty("--y", `${(coords.y / window.innerHeight) * 100}%`);
    }

    document.startViewTransition(() => {
      handleThemeChange(newMode);
    });
  };

  const value: ThemeProviderState = {
    theme: themeState.currentMode,
    setTheme: handleThemeChange,
    toggleTheme: handleThemeToggle,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
