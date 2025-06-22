"use client";

import DashboardExample from "@/components/examples/dashboard";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { CustomThemeApplier } from "./custom-theme-applier";

export default function DashboardExamplePage() {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <div className="relative">
      {/* Apply custom theme */}
      <CustomThemeApplier />

      {/* Theme toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleThemeToggle}
        className="fixed right-4 bottom-4 z-50 rounded-full shadow-lg"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span className="sr-only">Toggle theme</span>
      </Button>

      <DashboardExample />
    </div>
  );
}
