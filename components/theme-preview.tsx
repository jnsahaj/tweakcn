"use client";

import { useEffect, useState } from "react";
import { ThemeStyleProps } from "@/types/theme";
import { cn } from "@/lib/utils";
import { extractFontFamily } from "@/utils/fonts";
import { loadGoogleFont } from "@/utils/fonts/google-fonts";
import { colorFormatter } from "@/utils/color-converter";

interface ThemePreviewProps {
  styles: ThemeStyleProps;
  name?: string;
  className?: string;
}

function computeBoxShadow(styles: ThemeStyleProps): string | undefined {
  const shadowColor = styles["shadow-color"];
  const shadowOpacity = parseFloat(styles["shadow-opacity"] || "0.1");
  const shadowBlur = styles["shadow-blur"] || "3px";
  const shadowSpread = styles["shadow-spread"] || "0px";
  const offsetX = styles["shadow-offset-x"] || "0";
  const offsetY = styles["shadow-offset-y"] || "1px";

  try {
    const hsl = colorFormatter(shadowColor, "hsl", "3");
    const color = `hsl(${hsl} / ${shadowOpacity.toFixed(2)})`;
    return `${offsetX} ${offsetY} ${shadowBlur} ${shadowSpread} ${color}`;
  } catch {
    return undefined;
  }
}

export function ThemePreview({ styles, name, className }: ThemePreviewProps) {
  const fontSans = styles["font-sans"];
  const fontFamily = fontSans ? extractFontFamily(fontSans) : null;

  const [fontLoaded, setFontLoaded] = useState(() => {
    if (!fontFamily) return true;
    if (typeof document !== "undefined" && document.fonts) {
      return document.fonts.check(`700 16px "${fontFamily}"`);
    }
    return false;
  });

  useEffect(() => {
    if (!fontFamily) {
      setFontLoaded(true);
      return;
    }

    if (
      typeof document !== "undefined" &&
      document.fonts?.check(`700 46px "${fontFamily}"`)
    ) {
      setFontLoaded(true);
      return;
    }

    loadGoogleFont(fontFamily, ["400", "700"]);

    document.fonts
      .load(`700 16px "${fontFamily}"`)
      .then(() => setFontLoaded(true))
      .catch(() => setFontLoaded(true));
  }, [fontFamily]);

  const c = {
    bg: styles.background || "#ffffff",
    primary: styles.primary || "#000000",
    secondary: styles.secondary || "#f1f5f9",
    accent: styles.accent || "#f1f5f9",
    muted: styles.muted || "#f1f5f9",
    fg: styles.foreground || "#000000",
    primaryFg: styles["primary-foreground"] || "#ffffff",
    secondaryFg: styles["secondary-foreground"] || "#000000",
    accentFg: styles["accent-foreground"] || "#000000",
    mutedFg: styles["muted-foreground"] || "#666666",
    destructive: styles.destructive || "#ef4444",
    destructiveFg: styles["destructive-foreground"] || "#ffffff",
    card: styles.card || "#ffffff",
    cardFg: styles["card-foreground"] || "#000000",
    border: styles.border || "#e2e8f0",
    ring: styles.ring || "#000000",
    radius: styles.radius || "0.5",
  };

  const boxShadow = computeBoxShadow(styles);

  const palette = [
    c.primary,
    c.secondary,
    c.accent,
    c.muted,
    c.border,
    c.card,
  ];

  return (
    <div
      className={cn(
        "relative w-full h-full select-none overflow-hidden",
        className
      )}
      style={{
        backgroundColor: c.bg,
        color: c.fg,
      }}
    >
      {/* Color Palette - top right */}
      <div className="absolute top-3 right-3 flex flex-row gap-1.5">
        {palette.map((color, i) => (
          <div
            key={i}
            className="w-3 h-12"
            style={{
              borderRadius: `${parseFloat(c.radius) * 0.75}rem`,
              backgroundColor: color,
              border: color === c.bg ? `1px solid ${c.border}` : undefined,
              boxShadow,
            }}
          />
        ))}
      </div>

      {/* Typography - bottom left */}
      <div
        className="absolute bottom-3 left-3.5 max-w-[80%] truncate font-medium"
        style={{
          fontSize: "1.5rem",
          color: c.fg,
          fontFamily: fontLoaded ? fontSans || undefined : undefined,
          opacity: fontFamily && !fontLoaded ? 0 : 1,
          transition: "opacity 0.15s ease-in",
        }}
      >
        {name || "Aa"}
      </div>
    </div>
  );
}
