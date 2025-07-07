"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({ navItems }: { navItems: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 px-4 py-8">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:bg-muted block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive && "bg-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
