import { ThemeStyles, ThemeStyleProps } from "@/types/theme";
import { colorFormatter } from "@/utils/color-converter";
import { getShadowMap } from "@/utils/shadows";
import { defaultLightThemeStyles, defaultDarkThemeStyles } from "@/config/theme";
import { SYSTEM_FONTS } from "@/utils/fonts";

type FontConfig = {
  family: string;
  variable: string;
  variableName: string;
};

function extractFontFamily(fontFamilyValue: string): string | null {
  if (!fontFamilyValue) return null;
  const firstFont = fontFamilyValue.split(",")[0].trim();
  const cleanFont = firstFont.replace(/['"]/g, "");
  if (SYSTEM_FONTS.includes(cleanFont.toLowerCase())) return null;
  return cleanFont;
}

function toVariableName(fontFamily: string): string {
  // "Plus Jakarta Sans" -> "plusJakartaSans"
  const words = fontFamily.split(/\s+/);
  return words
    .map((word, i) => (i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

function toCssVariable(fontFamily: string): string {
  // "Plus Jakarta Sans" -> "--font-plus-jakarta-sans"
  return `--font-${fontFamily.toLowerCase().replace(/\s+/g, "-")}`;
}

function extractGoogleFonts(themeStyles: ThemeStyles): FontConfig[] {
  const fonts: FontConfig[] = [];
  const seen = new Set<string>();

  const fontKeys: (keyof ThemeStyleProps)[] = ["font-sans", "font-serif", "font-mono"];

  for (const key of fontKeys) {
    const fontValue = themeStyles.light[key] || themeStyles.dark[key];
    if (!fontValue) continue;

    const family = extractFontFamily(fontValue);
    if (!family || seen.has(family)) continue;

    seen.add(family);
    fonts.push({
      family,
      variable: toCssVariable(family),
      variableName: toVariableName(family),
    });
  }

  return fonts;
}

function formatColor(color: string): string {
  return colorFormatter(color, "oklch");
}

function generateColorVariables(styles: ThemeStyleProps): string {
  return `  --background: ${formatColor(styles.background)};
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
  --radius: ${styles.radius};
  --sidebar: ${formatColor(styles.sidebar)};
  --sidebar-foreground: ${formatColor(styles["sidebar-foreground"])};
  --sidebar-primary: ${formatColor(styles["sidebar-primary"])};
  --sidebar-primary-foreground: ${formatColor(styles["sidebar-primary-foreground"])};
  --sidebar-accent: ${formatColor(styles["sidebar-accent"])};
  --sidebar-accent-foreground: ${formatColor(styles["sidebar-accent-foreground"])};
  --sidebar-border: ${formatColor(styles["sidebar-border"])};
  --sidebar-ring: ${formatColor(styles["sidebar-ring"])};`;
}

export function generateV0GlobalsCss(themeStyles: ThemeStyles): string {
  const light = { ...defaultLightThemeStyles, ...themeStyles.light };
  const dark = { ...defaultDarkThemeStyles, ...themeStyles.dark };

  const lightShadows = getShadowMap({ styles: { light, dark }, currentMode: "light" });
  const darkShadows = getShadowMap({ styles: { light, dark }, currentMode: "dark" });

  const lightVars = generateColorVariables(light);
  const darkVars = generateColorVariables(dark);

  // Get font values with fallbacks
  // Transform "Roboto Mono, sans-serif" -> "Roboto Mono, Roboto Mono Fallback"
  const formatFontWithFallback = (fontValue: string): string => {
    const firstFont = fontValue.split(",")[0].trim().replace(/['"]/g, "");
    return `${firstFont}, ${firstFont} Fallback`;
  };

  const fontSans = formatFontWithFallback(
    light["font-sans"] || defaultLightThemeStyles["font-sans"]
  );
  const fontMono = formatFontWithFallback(
    light["font-mono"] || defaultLightThemeStyles["font-mono"]
  );
  const fontSerif = formatFontWithFallback(
    light["font-serif"] || defaultLightThemeStyles["font-serif"]
  );

  return `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: ${fontSans};
  --font-mono: ${fontMono};
  --font-serif: ${fontSerif};
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
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

:root {
${lightVars}
  --shadow-2xs: ${lightShadows["shadow-2xs"]};
  --shadow-xs: ${lightShadows["shadow-xs"]};
  --shadow-sm: ${lightShadows["shadow-sm"]};
  --shadow: ${lightShadows["shadow"]};
  --shadow-md: ${lightShadows["shadow-md"]};
  --shadow-lg: ${lightShadows["shadow-lg"]};
  --shadow-xl: ${lightShadows["shadow-xl"]};
  --shadow-2xl: ${lightShadows["shadow-2xl"]};
}

.dark {
${darkVars}
  --shadow-2xs: ${darkShadows["shadow-2xs"]};
  --shadow-xs: ${darkShadows["shadow-xs"]};
  --shadow-sm: ${darkShadows["shadow-sm"]};
  --shadow: ${darkShadows["shadow"]};
  --shadow-md: ${darkShadows["shadow-md"]};
  --shadow-lg: ${darkShadows["shadow-lg"]};
  --shadow-xl: ${darkShadows["shadow-xl"]};
  --shadow-2xl: ${darkShadows["shadow-2xl"]};
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
}

export function generateV0LayoutTsx(themeStyles: ThemeStyles): string {
  const fonts = extractGoogleFonts(themeStyles);
  const hasFonts = fonts.length > 0;

  // Generate font imports
  const fontImports = hasFonts
    ? `import { ${fonts.map((f) => f.family.replace(/\s+/g, "_")).join(", ")} } from "next/font/google";`
    : "";

  // Generate font declarations
  const fontDeclarations = fonts
    .map(
      (f) => `const _${f.variableName} = ${f.family.replace(/\s+/g, "_")}({ subsets: ["latin"] });`
    )
    .join("\n");

  const htmlClassName = hasFonts ? `className="font-sans"` : "";

  return `import type { Metadata } from "next";
${fontImports}
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

${fontDeclarations}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" ${htmlClassName}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}`;
}

export function generateV0PageTsx(themeName: string): string {
  return `function ColorSwatch({ name, bgClass }: { name: string; bgClass: string }) {
  return (
    <div className="group relative">
      <div
        className={\`aspect-square rounded-lg border border-border/50 \${bgClass} transition-transform duration-100 group-hover:scale-102\`}
      />
      <p className="mt-2 text-xs text-muted-foreground font-mono text-center truncate">{name}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-5xl mx-auto px-6 py-20">
          <h1 className="text-6xl font-bold tracking-tight text-balance">${themeName}</h1>
        </div>
      </div>

      {/* Color Palette */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-2">Color Palette</h2>
          <p className="text-muted-foreground mb-10">All the design tokens included in this theme.</p>

          <div className="grid gap-10">
            {/* Core Colors */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Core</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                <ColorSwatch name="background" bgClass="bg-background" />
                <ColorSwatch name="foreground" bgClass="bg-foreground" />
                <ColorSwatch name="primary" bgClass="bg-primary" />
                <ColorSwatch name="primary-fg" bgClass="bg-primary-foreground" />
                <ColorSwatch name="secondary" bgClass="bg-secondary" />
                <ColorSwatch name="secondary-fg" bgClass="bg-secondary-foreground" />
                <ColorSwatch name="accent" bgClass="bg-accent" />
                <ColorSwatch name="accent-fg" bgClass="bg-accent-foreground" />
              </div>
            </div>

            {/* UI Colors */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">UI Elements</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                <ColorSwatch name="card" bgClass="bg-card" />
                <ColorSwatch name="card-fg" bgClass="bg-card-foreground" />
                <ColorSwatch name="popover" bgClass="bg-popover" />
                <ColorSwatch name="popover-fg" bgClass="bg-popover-foreground" />
                <ColorSwatch name="muted" bgClass="bg-muted" />
                <ColorSwatch name="muted-fg" bgClass="bg-muted-foreground" />
                <ColorSwatch name="border" bgClass="bg-border" />
                <ColorSwatch name="input" bgClass="bg-input" />
              </div>
            </div>

            {/* Status & Chart */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Status & Charts</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                <ColorSwatch name="destructive" bgClass="bg-destructive" />
                <ColorSwatch name="ring" bgClass="bg-ring" />
                <ColorSwatch name="chart-1" bgClass="bg-chart-1" />
                <ColorSwatch name="chart-2" bgClass="bg-chart-2" />
                <ColorSwatch name="chart-3" bgClass="bg-chart-3" />
                <ColorSwatch name="chart-4" bgClass="bg-chart-4" />
                <ColorSwatch name="chart-5" bgClass="bg-chart-5" />
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Sidebar</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                <ColorSwatch name="sidebar" bgClass="bg-sidebar" />
                <ColorSwatch name="sidebar-fg" bgClass="bg-sidebar-foreground" />
                <ColorSwatch name="sidebar-primary" bgClass="bg-sidebar-primary" />
                <ColorSwatch name="sidebar-accent" bgClass="bg-sidebar-accent" />
                <ColorSwatch name="sidebar-border" bgClass="bg-sidebar-border" />
                <ColorSwatch name="sidebar-ring" bgClass="bg-sidebar-ring" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Built with tweakcn</p>
        </div>
      </footer>
    </main>
  );
}`;
}

export type V0RegistryFile = {
  path: string;
  content: string;
  type: "registry:file" | "registry:page";
  target: string;
};

export type V0RegistryPayload = {
  name: string;
  files: V0RegistryFile[];
  type: "registry:item";
};

export function generateV0RegistryPayload(
  themeName: string,
  themeStyles: ThemeStyles
): V0RegistryPayload {
  return {
    name: themeName,
    type: "registry:item",
    files: [
      {
        path: "app/globals.css",
        content: generateV0GlobalsCss(themeStyles),
        type: "registry:file",
        target: "app/globals.css",
      },
      {
        path: "app/layout.tsx",
        content: generateV0LayoutTsx(themeStyles),
        type: "registry:page",
        target: "app/layout.tsx",
      },
      {
        path: "app/page.tsx",
        content: generateV0PageTsx(themeName),
        type: "registry:page",
        target: "app/page.tsx",
      },
    ],
  };
}
