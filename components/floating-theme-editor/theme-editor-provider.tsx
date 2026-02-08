"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import FloatingThemeEditor to avoid hydration issues
const FloatingThemeEditor = dynamic(
  () => import("./floating-theme-editor").then((mod) => mod.FloatingThemeEditor),
  {
    ssr: false,
    loading: () => null,
  }
);

interface ThemeEditorProviderProps {
  children: React.ReactNode;
  /**
   * Enable the floating theme editor
   * @default false (only enabled in development)
   */
  enabled?: boolean;
  /**
   * Show the editor by default
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * Provider component for the floating theme editor.
 * Automatically injects the theme editor into your Next.js app.
 *
 * @example
 * ```tsx
 * // In your root layout.tsx
 * <ThemeEditorProvider>
 *   {children}
 * </ThemeEditorProvider>
 * ```
 */
export function ThemeEditorProvider({
  children,
  enabled,
  defaultOpen = false,
}: ThemeEditorProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Only show in development by default, but can be overridden
  const shouldShow = enabled ?? process.env.NODE_ENV === "development";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering on client
  if (!isMounted || !shouldShow) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <FloatingThemeEditor defaultOpen={defaultOpen} />
    </>
  );
}
