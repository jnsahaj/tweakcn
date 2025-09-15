import { Loader } from "@/components/loader";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFeedbackText } from "@/hooks/use-feedback-text";
import { cn } from "@/lib/utils";
import { ThemeStyles } from "@/types/theme";
import { applyGeneratedTheme } from "@/utils/ai/apply-theme";
import { AlertCircle, CheckCheck, ChevronsUpDown, Loader2, Zap } from "lucide-react";
import { ComponentProps, useState } from "react";

type ChatThemePreviewProps = ComponentProps<"div"> & ChatThemePreviewPropsBase;

type ChatThemePreviewPropsBase =
  | {
      status: "loading";
      expanded?: boolean;
      themeStyles?: Partial<ThemeStyles>;
    }
  | {
      status: "error";
      expanded?: boolean;
      errorText?: string;
      themeStyles?: Partial<ThemeStyles>;
    }
  | {
      status: "complete";
      expanded?: boolean;
      themeStyles: ThemeStyles;
    };

export function ChatThemePreview({
  status,
  expanded = false,
  themeStyles,
  className,
  children,
  ...props
}: ChatThemePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { theme: mode } = useTheme();
  const loading = status === "loading";

  const feedbackText = useFeedbackText({
    showFeedbackText: loading,
    feedbackMessages: FEEDBACK_MESSAGES,
    rotationIntervalInSeconds: 8,
  });

  if (loading) {
    return (
      <Card className={cn("w-full max-w-[550px] overflow-hidden rounded-lg shadow-none")}>
        <div className="flex size-full h-10 items-center gap-2 p-1.5">
          <div className="bg-muted flex size-7 items-center justify-center rounded-sm">
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
          </div>

          <Loader variant="text-shimmer" text={feedbackText} size="md" />
        </div>
      </Card>
    );
  }

  if (status === "error")
    return (
      <Card className={cn("max-w-[550px] overflow-hidden rounded-lg shadow-none")}>
        <div className="flex size-full h-10 items-center gap-2 p-1.5">
          <div className="bg-destructive flex size-7 items-center justify-center rounded-sm">
            <AlertCircle className="text-destructive-foreground size-4" />
          </div>
          <span className="text-foreground/90 text-sm">Generation cancelled or failed.</span>
        </div>
      </Card>
    );

  const handleApplyTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "complete") applyGeneratedTheme(themeStyles);
  };

  if (status === "complete")
    return (
      <Card className={cn("max-w-[550px] overflow-hidden rounded-lg shadow-none")}>
        <div
          className={cn(
            "group/control hover:bg-background/50 flex h-10 w-full shrink-0 cursor-pointer items-center gap-2 p-1.5 pr-2 transition-colors duration-300 ease-in-out",
            isExpanded ? "border-b" : "border-transparent"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="bg-primary/15 flex size-7 items-center justify-center rounded-sm">
            <CheckCheck className="text-primary size-4" />
          </div>

          <div className="flex gap-1">
            <div
              className="ring-border size-3 rounded-sm ring-1 @sm:size-4"
              style={{ backgroundColor: themeStyles[mode].primary }}
            />
            <div
              className="ring-border size-3 rounded-sm ring-1 @sm:size-4"
              style={{ backgroundColor: themeStyles[mode].secondary }}
            />
            <div
              className="ring-border size-3 rounded-sm ring-1 @sm:size-4"
              style={{ backgroundColor: themeStyles[mode].background }}
            />
            <div
              className="ring-border size-3 rounded-sm ring-1 @sm:size-4"
              style={{ backgroundColor: themeStyles[mode].muted }}
            />
            <div
              className="ring-border size-3 rounded-sm ring-1 @sm:size-4"
              style={{ backgroundColor: themeStyles[mode].accent }}
            />
            <div
              className="ring-border size-3 rounded-sm ring-1 @sm:size-4"
              style={{ backgroundColor: themeStyles[mode].border }}
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              className="h-7 gap-1.5 px-2 shadow-none"
              onClick={handleApplyTheme}
            >
              <Zap className="size-3.5!" />
              Apply
            </Button>

            <button
              type="button"
              className="text-foreground/75 group-hover/control:text-foreground ml-auto transition-colors"
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            >
              <ChevronsUpDown className="size-4" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className={cn("space-y-2 p-2.5", className)} {...props}>
              {children}
            </div>
          </div>
        </div>
      </Card>
    );

  return null;
}

const FEEDBACK_MESSAGES = [
  "Generating your theme...",
  "Tweaking color tokens...",
  "Making a good theme takes time...",
  "Still working on your theme...",
  "Almost there...",
];
