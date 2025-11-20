import { CreditCard, Sparkles, Palette, Figma, Settings, ChartNoAxesCombined } from "lucide-react";

interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    keywords?: string[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        id: "editor",
        label: "Editor",
        href: "/editor/theme",
        icon: Palette,
        keywords: ["theme", "edit", "create"],
    },
    {
        id: "pricing",
        label: "Pricing",
        href: "/pricing",
        icon: CreditCard,
        keywords: ["pro", "subscribe", "upgrade"],
    },
    {
        id: "ai",
        label: "AI Generator",
        href: "/ai",
        icon: Sparkles,
        keywords: ["generate", "ai", "create"],
    },
    {
        id: "figma",
        label: "Figma",
        href: "/figma",
        icon: Figma,
        keywords: ["figma", "design", "import"],
    },
    {
        id: "settings-themes",
        label: "Themes Settings",
        href: "/settings/themes",
        icon: Settings,
        keywords: ["settings", "themes", "manage"],
    },
    {
        id: "settings-usage",
        label: "AI Usage",
        href: "/settings/usage",
        icon: ChartNoAxesCombined,
        keywords: ["settings", "usage", "stats"],
    },
];
