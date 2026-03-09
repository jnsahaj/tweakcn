"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ColorPicker from "@/components/editor/color-picker";
import ControlSection from "@/components/editor/control-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FocusColorId } from "@/store/color-control-focus-store";
import { ThemeStyleProps } from "@/types/theme";

type ColorEntry = {
  key: keyof ThemeStyleProps;
  name: FocusColorId;
  label: string;
};

type ColorGroup = {
  title: string;
  expanded?: boolean;
  colors: ColorEntry[];
};

const COLOR_GROUPS: ColorGroup[] = [
  {
    title: "Primary",
    expanded: true,
    colors: [
      { key: "primary", name: "primary", label: "Background" },
      { key: "primary-foreground", name: "primary-foreground", label: "Foreground" },
    ],
  },
  {
    title: "Secondary",
    expanded: true,
    colors: [
      { key: "secondary", name: "secondary", label: "Background" },
      { key: "secondary-foreground", name: "secondary-foreground", label: "Foreground" },
    ],
  },
  {
    title: "Accent",
    colors: [
      { key: "accent", name: "accent", label: "Background" },
      { key: "accent-foreground", name: "accent-foreground", label: "Foreground" },
    ],
  },
  {
    title: "Base",
    colors: [
      { key: "background", name: "background", label: "Background" },
      { key: "foreground", name: "foreground", label: "Foreground" },
    ],
  },
  {
    title: "Card",
    colors: [
      { key: "card", name: "card", label: "Background" },
      { key: "card-foreground", name: "card-foreground", label: "Foreground" },
    ],
  },
  {
    title: "Popover",
    colors: [
      { key: "popover", name: "popover", label: "Background" },
      { key: "popover-foreground", name: "popover-foreground", label: "Foreground" },
    ],
  },
  {
    title: "Muted",
    colors: [
      { key: "muted", name: "muted", label: "Background" },
      { key: "muted-foreground", name: "muted-foreground", label: "Foreground" },
    ],
  },
  {
    title: "Destructive",
    colors: [
      { key: "destructive", name: "destructive", label: "Background" },
      { key: "destructive-foreground", name: "destructive-foreground", label: "Foreground" },
    ],
  },
  {
    title: "Border & Input",
    colors: [
      { key: "border", name: "border", label: "Border" },
      { key: "input", name: "input", label: "Input" },
      { key: "ring", name: "ring", label: "Ring" },
    ],
  },
  {
    title: "Chart",
    colors: [
      { key: "chart-1", name: "chart-1", label: "Chart 1" },
      { key: "chart-2", name: "chart-2", label: "Chart 2" },
      { key: "chart-3", name: "chart-3", label: "Chart 3" },
      { key: "chart-4", name: "chart-4", label: "Chart 4" },
      { key: "chart-5", name: "chart-5", label: "Chart 5" },
    ],
  },
  {
    title: "Sidebar",
    colors: [
      { key: "sidebar", name: "sidebar", label: "Background" },
      { key: "sidebar-foreground", name: "sidebar-foreground", label: "Foreground" },
      { key: "sidebar-primary", name: "sidebar-primary", label: "Primary" },
      { key: "sidebar-primary-foreground", name: "sidebar-primary-foreground", label: "Primary FG" },
      { key: "sidebar-accent", name: "sidebar-accent", label: "Accent" },
      { key: "sidebar-accent-foreground", name: "sidebar-accent-foreground", label: "Accent FG" },
      { key: "sidebar-border", name: "sidebar-border", label: "Border" },
      { key: "sidebar-ring", name: "sidebar-ring", label: "Ring" },
    ],
  },
];

interface ColorsTabContentProps {
  currentStyles: ThemeStyleProps;
  updateStyle: <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void;
}

export function ColorsTabContent({ currentStyles, updateStyle }: ColorsTabContentProps) {
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return COLOR_GROUPS;

    const query = search.toLowerCase();
    return COLOR_GROUPS.map((group) => ({
      ...group,
      expanded: true,
      colors: group.colors.filter(
        (c) =>
          c.label.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query) ||
          group.title.toLowerCase().includes(query)
      ),
    })).filter((group) => group.colors.length > 0);
  }, [search]);

  return (
    <div className="flex min-h-0 h-full flex-col">
      <div className="px-4 pb-3">
        <div className="bg-muted/50 flex items-center gap-2.5 rounded-lg border px-3">
          <Search className="text-muted-foreground size-4 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search colors..."
            className="text-foreground placeholder:text-muted-foreground h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4">
        {filteredGroups.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-xs">No colors found</p>
        )}
        {filteredGroups.map((group) => (
          <ControlSection
            key={group.title}
            title={group.title}
            expanded={group.expanded}
          >
            {group.colors.map((color) => (
              <ColorPicker
                key={color.name}
                name={color.name}
                color={currentStyles[color.key] as string}
                onChange={(value) => updateStyle(color.key, value as ThemeStyleProps[typeof color.key])}
                label={color.label}
              />
            ))}
          </ControlSection>
        ))}
      </ScrollArea>
    </div>
  );
}
