import { useTheme } from "@/components/theme-provider";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { cn } from "@/lib/utils";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <div className="px-2">
      <TooltipWrapper label="Toggle light/dark mode" asChild>
        <SwitchPrimitives.Root
          checked={theme === "dark"}
          onClick={handleThemeToggle}
          className={cn(
            "peer focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            theme === "dark" ? "bg-primary" : "bg-input"
          )}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              "bg-background pointer-events-none flex size-5 items-center justify-center rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
            )}
          >
            {theme === "dark" ? <Moon className="size-3" /> : <Sun className="size-3" />}
          </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
      </TooltipWrapper>
    </div>
  );
}
