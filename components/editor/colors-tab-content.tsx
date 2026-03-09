"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, X } from "lucide-react";
import ColorPicker from "@/components/editor/color-picker";
import ControlSection from "@/components/editor/control-section";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { cn } from "@/lib/utils";
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

// Maps sidebar color keys to their base counterparts
const SIDEBAR_SYNC_MAP: Partial<Record<keyof ThemeStyleProps, keyof ThemeStyleProps>> = {
  sidebar: "background",
  "sidebar-foreground": "foreground",
  "sidebar-primary": "primary",
  "sidebar-primary-foreground": "primary-foreground",
  "sidebar-accent": "accent",
  "sidebar-accent-foreground": "accent-foreground",
  "sidebar-border": "border",
  "sidebar-ring": "ring",
};

// Reverse map: base key → sidebar key
const BASE_TO_SIDEBAR_MAP = Object.fromEntries(
  Object.entries(SIDEBAR_SYNC_MAP).map(([sidebar, base]) => [base, sidebar])
) as Partial<Record<keyof ThemeStyleProps, keyof ThemeStyleProps>>;

interface ColorsTabContentProps {
  currentStyles: ThemeStyleProps;
  updateStyle: <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void;
  updateStyles: (updates: Partial<ThemeStyleProps>) => void;
}

export function ColorsTabContent({ currentStyles, updateStyle, updateStyles }: ColorsTabContentProps) {
  const [search, setSearch] = useState("");
  const [sidebarSyncEnabled, setSidebarSyncEnabled] = useState(false);

  // Sync all sidebar colors to their base counterparts in a single batch
  const syncSidebarToBase = useCallback(() => {
    const updates: Partial<ThemeStyleProps> = {};
    for (const [sidebarKey, baseKey] of Object.entries(SIDEBAR_SYNC_MAP)) {
      const baseValue = currentStyles[baseKey as keyof ThemeStyleProps];
      if (baseValue !== undefined) {
        (updates as Record<string, unknown>)[sidebarKey] = baseValue;
      }
    }
    updateStyles(updates);
  }, [currentStyles, updateStyles]);

  const toggleSidebarSync = useCallback(() => {
    setSidebarSyncEnabled((prev) => !prev);
  }, []);

  // Sync sidebar colors when toggle is turned on
  useEffect(() => {
    if (sidebarSyncEnabled) {
      syncSidebarToBase();
    }
    // Only run when sync is toggled on, not when syncSidebarToBase changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarSyncEnabled]);

  // Keep sidebar in sync when base colors change while sync is enabled
  const wrappedUpdateStyle = useCallback(
    <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => {
      // If sync is on and a base color changed, batch both updates together
      if (sidebarSyncEnabled && key in BASE_TO_SIDEBAR_MAP) {
        const sidebarKey = BASE_TO_SIDEBAR_MAP[key]!;
        updateStyles({
          [key]: value,
          [sidebarKey]: value,
        } as Partial<ThemeStyleProps>);
      } else {
        updateStyle(key, value);
      }
    },
    [updateStyle, updateStyles, sidebarSyncEnabled]
  );

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
            headerAction={
              group.title === "Sidebar" ? (
                <TooltipWrapper
                  label="Sync sidebar colors to their base counterparts (e.g. sidebar background → background)"
                  asChild
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebarSync}
                    className={cn(
                      "group h-auto px-1.5 py-0.5 text-[11px]",
                      sidebarSyncEnabled
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <RefreshCw
                      className={cn(
                        "size-3 transition-all group-hover:scale-110",
                        sidebarSyncEnabled && "animate-none"
                      )}
                    />
                    <span className="uppercase tracking-wider">
                      {sidebarSyncEnabled ? "Sync on" : "Sync"}
                    </span>
                  </Button>
                </TooltipWrapper>
              ) : undefined
            }
          >
            {group.colors.map((color) => (
              <ColorPicker
                key={color.name}
                name={color.name}
                color={currentStyles[color.key] as string}
                onChange={(value) => wrappedUpdateStyle(color.key, value as ThemeStyleProps[typeof color.key])}
                label={color.label}
              />
            ))}
          </ControlSection>
        ))}
      </ScrollArea>
    </div>
  );
}
