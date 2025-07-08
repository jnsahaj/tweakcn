"use client";

import { cn } from "@/lib/utils";
import { ChartNoAxesCombined, LucideIcon, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/settings/themes", label: "Themes", icon: Palette },
  { href: "/settings/usage", label: "AI Usage", icon: ChartNoAxesCombined },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:bg-muted flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive && "bg-muted"
              )}
            >
              {item.icon && <item.icon className="size-4" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
