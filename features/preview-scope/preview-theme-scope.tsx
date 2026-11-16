"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { applyScopedTheme } from "./apply-scoped-theme";

/**
 * Where portalled UI (dialogs, dropdowns, popovers, tooltips, sheets…) should render.
 * `undefined` outside the preview, so the editor's own popovers keep rendering into `document.body`
 * with the editor's neutral theme.
 */
const PreviewPortalContext = createContext<HTMLElement | undefined>(undefined);

export const usePreviewPortalContainer = () => useContext(PreviewPortalContext);

// Classes that make a themed box look like the old page-level theme did (body styles).
const THEMED_BOX = "bg-background text-foreground font-sans tracking-normal";

type PreviewThemeScopeProps = React.HTMLAttributes<HTMLElement> & { children: React.ReactNode };

/**
 * Applies the theme being edited to the preview area only, plus a body-level portal container that
 * carries the same theme, so overlays opened from the preview are themed too.
 */
export function PreviewThemeScope({ children, className, ...props }: PreviewThemeScopeProps) {
  const themeState = useEditorStore((s) => s.themeState);
  const scopeRef = useRef<HTMLElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement>();

  useEffect(() => {
    const el = document.createElement("div");
    el.dataset.previewPortalRoot = "";
    el.className = "text-foreground font-sans tracking-normal";
    document.body.appendChild(el);
    setPortalRoot(el);
    return () => el.remove();
  }, []);

  useLayoutEffect(() => {
    if (scopeRef.current) applyScopedTheme(themeState, scopeRef.current);
    if (portalRoot) applyScopedTheme(themeState, portalRoot);
  }, [themeState, portalRoot]);

  return (
    <PreviewPortalContext.Provider value={portalRoot}>
      <section ref={scopeRef} data-preview-theme-scope="" className={cn(THEMED_BOX, className)} {...props}>
        {children}
      </section>
    </PreviewPortalContext.Provider>
  );
}
