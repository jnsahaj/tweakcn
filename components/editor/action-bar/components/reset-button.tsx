import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface ResetButtonProps extends React.ComponentProps<typeof Button> {}

export function ResetButton({ className, ...props }: ResetButtonProps) {
  return (
    <TooltipWrapper label="Reset to preset defaults" asChild>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-muted-foreground hover:text-foreground hover:bg-accent/50 h-8 gap-1.5 px-2",
          className
        )}
        {...props}
      >
        <RefreshCw className="size-3.5" />
        <span className="hidden text-sm md:block">Reset</span>
      </Button>
    </TooltipWrapper>
  );
}
