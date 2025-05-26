import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { ThemeStyles } from "@/types/theme";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ComponentProps, useState } from "react";

interface ChatThemePreviewProps extends ComponentProps<"div"> {
  themeStyles: ThemeStyles;
}

export function ChatThemePreview({
  themeStyles,
  className,
  children,
  ...props
}: ChatThemePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme: mode } = useTheme();

  return (
    <div className={cn("border-border/75! max-w-[550px] overflow-hidden rounded-lg border")}>
      <div
        className={cn(
          "group/control bg-background hover:bg-muted/40 flex h-10 w-full shrink-0 cursor-pointer items-center justify-between gap-4 p-2.5 transition-colors duration-300 ease-in-out",
          isExpanded ? "bg-muted/40" : "border-transparent"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3
          className={cn(
            "group-hover/control:text-foreground text-foreground/75 text-sm font-medium",
            isExpanded && "text-foreground"
          )}
        >
          Preview
        </h3>
        <div className="flex gap-0.5">
          <div
            className="border-muted bg-primary h-3 w-3 rounded-sm border"
            style={{ backgroundColor: themeStyles[mode].primary }}
          />
          <div
            className="border-muted bg-secondary h-3 w-3 rounded-sm border"
            style={{ backgroundColor: themeStyles[mode].secondary }}
          />
          <div
            className="border-muted bg-background h-3 w-3 rounded-sm border"
            style={{ backgroundColor: themeStyles[mode].background }}
          />
          <div
            className="border-muted bg-muted h-3 w-3 rounded-sm border"
            style={{ backgroundColor: themeStyles[mode].muted }}
          />
          <div
            className="border-muted bg-accent h-3 w-3 rounded-sm border"
            style={{ backgroundColor: themeStyles[mode].accent }}
          />
          <div
            className="border-muted bg-border h-3 w-3 rounded-sm border"
            style={{ backgroundColor: themeStyles[mode].border }}
          />
        </div>
        <button
          type="button"
          className="text-foreground/75 group-hover/control:text-foreground ml-auto transition-colors"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="bg-background overflow-hidden">
          <div className={cn("space-y-2 p-2.5", className)} {...props}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
