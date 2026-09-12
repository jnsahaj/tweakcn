import { ThemeEditorState } from "@/types/editor";
import { colorFormatter } from "./color-converter";
import { ColorFormat } from "../types";
import { defaultLightThemeStyles } from "@/config/theme";
import { ThemeStyles } from "@/types/theme";
import { extractFontFamily } from "./fonts";
import { getShadowMap } from "./shadows";

type ThemeMode = "light" | "dark";

const generateColorVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string
): string => {
  const styles = themeStyles[mode];
  return `
  --background: ${formatColor(styles.background)};
  --foreground: ${formatColor(styles.foreground)};
  --card: ${formatColor(styles.card)};
  --card-foreground: ${formatColor(styles["card-foreground"])};
  --popover: ${formatColor(styles.popover)};
  --popover-foreground: ${formatColor(styles["popover-foreground"])};
  --primary: ${formatColor(styles.primary)};
  --primary-foreground: ${formatColor(styles["primary-foreground"])};
  --secondary: ${formatColor(styles.secondary)};
  --secondary-foreground: ${formatColor(styles["secondary-foreground"])};
  --muted: ${formatColor(styles.muted)};
  --muted-foreground: ${formatColor(styles["muted-foreground"])};
  --accent: ${formatColor(styles.accent)};
  --accent-foreground: ${formatColor(styles["accent-foreground"])};
  --destructive: ${formatColor(styles.destructive)};
  --destructive-foreground: ${formatColor(styles["destructive-foreground"])};
  --border: ${formatColor(styles.border)};
  --input: ${formatColor(styles.input)};
  --ring: ${formatColor(styles.ring)};
  --chart-1: ${formatColor(styles["chart-1"])};
  --chart-2: ${formatColor(styles["chart-2"])};
  --chart-3: ${formatColor(styles["chart-3"])};
  --chart-4: ${formatColor(styles["chart-4"])};
  --chart-5: ${formatColor(styles["chart-5"])};
  --sidebar: ${formatColor(styles.sidebar)};
  --sidebar-foreground: ${formatColor(styles["sidebar-foreground"])};
  --sidebar-primary: ${formatColor(styles["sidebar-primary"])};
  --sidebar-primary-foreground: ${formatColor(styles["sidebar-primary-foreground"])};
  --sidebar-accent: ${formatColor(styles["sidebar-accent"])};
  --sidebar-accent-foreground: ${formatColor(styles["sidebar-accent-foreground"])};
  --sidebar-border: ${formatColor(styles["sidebar-border"])};
  --sidebar-ring: ${formatColor(styles["sidebar-ring"])};`;
};

const generateFontVariables = (themeStyles: ThemeStyles, mode: ThemeMode): string => {
  const styles = themeStyles[mode];
  return `
  --font-sans: ${styles["font-sans"]};
  --font-serif: ${styles["font-serif"]};
  --font-mono: ${styles["font-mono"]};`;
};

const generateRawShadowVariables = (themeStyles: ThemeStyles, mode: ThemeMode): string => {
  const styles = themeStyles[mode];
  return `
  --shadow-x: ${styles["shadow-offset-x"]};
  --shadow-y: ${styles["shadow-offset-y"]};
  --shadow-blur: ${styles["shadow-blur"]};
  --shadow-spread: ${styles["shadow-spread"]};
  --shadow-opacity: ${styles["shadow-opacity"]};
  --shadow-color: ${styles["shadow-color"]};`;
};

// Tailwind v3 has no `@utility` mechanism (see generateTailwindV4ThemeInline's
// comment for why v4 composes shadow-md etc by hand instead of baking a
// color into an inherited custom property), so its exported CSS still needs
// a literal, fully-composed box-shadow value per size -- the same shape
// `getShadowMap` already produces for the shadcn/v0 registry exporters.
// v3-only: v4's shadow-{color} override only works because v4 never
// declares these as a pre-composed inherited property in the first place.
const generateComposedShadowVariables = (themeStyles: ThemeStyles, mode: ThemeMode): string => {
  const shadowMap = getShadowMap({
    styles: themeStyles,
    currentMode: mode,
  } as ThemeEditorState);
  return `
  --shadow-2xs: ${shadowMap["shadow-2xs"]};
  --shadow-xs: ${shadowMap["shadow-xs"]};
  --shadow-sm: ${shadowMap["shadow-sm"]};
  --shadow: ${shadowMap["shadow"]};
  --shadow-md: ${shadowMap["shadow-md"]};
  --shadow-lg: ${shadowMap["shadow-lg"]};
  --shadow-xl: ${shadowMap["shadow-xl"]};
  --shadow-2xl: ${shadowMap["shadow-2xl"]};`;
};

const generateTrackingVariables = (themeStyles: ThemeStyles): string => {
  const styles = themeStyles["light"];
  if (styles["letter-spacing"] === "0em") {
    return "";
  }
  return `

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);`;
};

const generateThemeVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string,
  includeComposedShadowVars: boolean
): string => {
  const selector = mode === "dark" ? ".dark" : ":root";
  const colorVars = generateColorVariables(themeStyles, mode, formatColor);
  const fontVars = generateFontVariables(themeStyles, mode);
  const radiusVar = `\n  --radius: ${themeStyles[mode].radius};`;
  const rawShadowVars = generateRawShadowVariables(themeStyles, mode);
  // Only Tailwind v3's export needs the fully-composed variables -- see the
  // comment on generateComposedShadowVariables for why.
  const composedShadowVars = includeComposedShadowVars
    ? generateComposedShadowVariables(themeStyles, mode)
    : "";
  const spacingVar =
    mode === "light"
      ? `\n  --spacing: ${themeStyles["light"].spacing ?? defaultLightThemeStyles.spacing};`
      : "";

  const trackingVars =
    mode === "light"
      ? `\n  --tracking-normal: ${themeStyles["light"]["letter-spacing"] ?? defaultLightThemeStyles["letter-spacing"]};`
      : "";

  return (
    selector +
    " {" +
    colorVars +
    fontVars +
    radiusVar +
    rawShadowVars +
    composedShadowVars +
    trackingVars +
    spacingVar +
    "\n}"
  );
};

// Kept in sync with the identical @utility rules in app/globals.css -- see
// the comment there for why box-shadow is composed by hand here instead of
// letting `@theme inline` generate it (fix for #124).
const SHADOW_UTILITIES = `@utility shadow-2xs {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
    var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 0.5)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}

@utility shadow-xs {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
    var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 0.5)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}

@utility shadow-sm {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1))),
    var(--shadow-x) 1px 2px calc(var(--shadow-spread) - 1px)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}

@utility shadow {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1))),
    var(--shadow-x) 1px 2px calc(var(--shadow-spread) - 1px)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}

@utility shadow-md {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1))),
    var(--shadow-x) 2px 4px calc(var(--shadow-spread) - 1px)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}

@utility shadow-lg {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1))),
    var(--shadow-x) 4px 6px calc(var(--shadow-spread) - 1px)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}

@utility shadow-xl {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1))),
    var(--shadow-x) 8px 10px calc(var(--shadow-spread) - 1px)
      var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 1)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}

@utility shadow-2xl {
  --tw-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
    var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / calc(var(--shadow-opacity) * 2.5)));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
}`;

const generateTailwindV4ThemeInline = (themeStyles: ThemeStyles): string => {
  return `@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Shadow utilities are handled by the hand-written @utility rules below
     instead (see the comment above them), so unset Tailwind's own built-in
     shadow-* theme keys here -- otherwise Tailwind would still generate its
     default (non-themeable) shadow-md etc utilities alongside ours, and
     those would win. */
  --shadow-2xs: initial;
  --shadow-xs: initial;
  --shadow-sm: initial;
  --shadow: initial;
  --shadow-md: initial;
  --shadow-lg: initial;
  --shadow-xl: initial;
  --shadow-2xl: initial;${generateTrackingVariables(themeStyles)}
}

/*
 * A shadow-{color} utility (e.g. shadow-blue-500) only sets --tw-shadow-color;
 * it relies on the shadow-md/lg/etc utility itself referencing
 * var(--tw-shadow-color, <fallback>) to have any effect. Tailwind can only
 * generate that reference when it knows the shadow's color at build time --
 * ours is user-configurable at runtime (--shadow-color/--shadow-opacity
 * above), so it can't. These rules do the same composition by hand, with
 * the var(--tw-shadow-color, ...) fallback written directly into the rule
 * that targets the element, so shadow-{color} keeps working.
 */
${SHADOW_UTILITIES}`;
};

const generateTailwindV3Config = (
  _themeStyles: ThemeStyles,
  colorFormat: ColorFormat = "hsl"
): string => {
  const colorToken = (key: string) => {
    return colorFormat === "hsl" ? `"hsl(var(--${key}))"` : `"var(--${key})"`;
  };

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: ${colorToken("border")},
        input: ${colorToken("input")},
        ring: ${colorToken("ring")},
        background: ${colorToken("background")},
        foreground: ${colorToken("foreground")},
        primary: {
          DEFAULT: ${colorToken("primary")},
          foreground: ${colorToken("primary-foreground")},
        },
        secondary: {
          DEFAULT: ${colorToken("secondary")},
          foreground: ${colorToken("secondary-foreground")},
        },
        destructive: {
          DEFAULT: ${colorToken("destructive")},
          foreground: ${colorToken("destructive-foreground")},
        },
        muted: {
            DEFAULT: ${colorToken("muted")},
          foreground: ${colorToken("muted-foreground")},
        },
        accent: {
          DEFAULT: ${colorToken("accent")},
          foreground: ${colorToken("accent-foreground")},
        },
        popover: {
          DEFAULT: ${colorToken("popover")},
          foreground: ${colorToken("popover-foreground")},
        },
        card: {
          DEFAULT: ${colorToken("card")},
          foreground: ${colorToken("card-foreground")},
        },
        sidebar: {
          DEFAULT: ${colorToken("sidebar")},
          foreground: ${colorToken("sidebar-foreground")},
          primary: ${colorToken("sidebar-primary")},
          "primary-foreground": ${colorToken("sidebar-primary-foreground")},
          accent: ${colorToken("sidebar-accent")},
          "accent-foreground": ${colorToken("sidebar-accent-foreground")},
          border: ${colorToken("sidebar-border")},
          ring: ${colorToken("sidebar-ring")},
        },
        chart: {
          1: ${colorToken("chart-1")},
          2: ${colorToken("chart-2")},
          3: ${colorToken("chart-3")},
          4: ${colorToken("chart-4")},
          5: ${colorToken("chart-5")},
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
}`;
};

const indentBlock = (str: string): string =>
  str
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join("\n");

export const generateThemeCode = (
  themeEditorState: ThemeEditorState,
  colorFormat: ColorFormat = "hsl",
  tailwindVersion: "3" | "4" = "3"
): string => {
  if (
    !themeEditorState ||
    !("light" in themeEditorState.styles) ||
    !("dark" in themeEditorState.styles)
  ) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }

  const themeStyles = themeEditorState.styles as ThemeStyles;
  const formatColor = (color: string) => colorFormatter(color, colorFormat, tailwindVersion);

  const includeComposedShadowVars = tailwindVersion !== "4";
  const lightTheme = generateThemeVariables(
    themeStyles,
    "light",
    formatColor,
    includeComposedShadowVars
  );
  const darkTheme = generateThemeVariables(
    themeStyles,
    "dark",
    formatColor,
    includeComposedShadowVars
  );

  if (tailwindVersion === "4") {
    const tailwindV4Theme = generateTailwindV4ThemeInline(themeStyles);

    const bodyLetterSpacing =
      themeStyles["light"]["letter-spacing"] !== "0em"
        ? "\n    letter-spacing: var(--tracking-normal);"
        : "";

    return `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

${lightTheme}

${darkTheme}

${tailwindV4Theme}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;${bodyLetterSpacing}
  }
}`;
  }

  // Tailwind v3
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
${indentBlock(lightTheme)}

${indentBlock(darkTheme)}
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
};

export const generateTailwindConfigCode = (
  themeEditorState: ThemeEditorState,
  colorFormat: ColorFormat = "hsl",
  _tailwindVersion: "3" | "4" = "3"
): string => {
  if (
    !themeEditorState ||
    !("light" in themeEditorState.styles) ||
    !("dark" in themeEditorState.styles)
  ) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }

  const themeStyles = themeEditorState.styles as ThemeStyles;
  return generateTailwindV3Config(themeStyles, colorFormat);
};

const FONT_SLOTS = [
  { key: "font-sans" as const, varName: "fontSans", cssVar: "--font-sans" },
  { key: "font-serif" as const, varName: "fontSerif", cssVar: "--font-serif" },
  { key: "font-mono" as const, varName: "fontMono", cssVar: "--font-mono" },
];

export const generateLayoutCode = (themeEditorState: ThemeEditorState): string => {
  if (
    !themeEditorState ||
    !("light" in themeEditorState.styles) ||
    !("dark" in themeEditorState.styles)
  ) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }

  const themeStyles = themeEditorState.styles as ThemeStyles;
  const lightStyles = themeStyles.light;

  const googleFonts: { importName: string; varName: string; cssVar: string }[] = [];

  for (const slot of FONT_SLOTS) {
    const fontValue = lightStyles[slot.key];
    const fontFamily = extractFontFamily(fontValue);
    if (fontFamily) {
      googleFonts.push({
        importName: fontFamily.replace(/ /g, "_"),
        varName: slot.varName,
        cssVar: slot.cssVar,
      });
    }
  }

  const comment = `// For adding custom fonts with other frameworks, see:\n// https://tailwindcss.com/docs/font-family`;

  if (googleFonts.length === 0) {
    return `${comment}
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}`;
  }

  const importNames = googleFonts.map((f) => f.importName).join(", ");

  const fontConfigs = googleFonts
    .map(
      (f) => `
const ${f.varName} = ${f.importName}({
  subsets: ["latin"],
  variable: "${f.cssVar}",
});`
    )
    .join("\n");

  const classNameParts = googleFonts.map((f) => `\${${f.varName}.variable}`).join(" ");

  return `${comment}
import type { Metadata } from "next";
import { ${importNames} } from "next/font/google";
import "./globals.css";
${fontConfigs}

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={\`${classNameParts} antialiased\`}>
        {children}
      </body>
    </html>
  );
}`;
};
