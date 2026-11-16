"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandPalettesSection } from "./brand-palettes-section";
import { RolesSection } from "./roles-section";
import { ThemeCheckSection } from "@/features/app-shell/components/theme-check-section";

/**
 * The editor's "Brand" tab. Each entry is one self-contained `ControlSection`; to add a section
 * (e.g. Fonts for custom font upload), append its component here.
 */
const BRAND_SECTIONS: { id: string; Component: React.ComponentType }[] = [
  { id: "palettes", Component: BrandPalettesSection },
  { id: "roles", Component: RolesSection },
  { id: "check", Component: ThemeCheckSection },
];

export function BrandTabContent() {
  return (
    <ScrollArea className="h-full px-4">
      {BRAND_SECTIONS.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </ScrollArea>
  );
}
