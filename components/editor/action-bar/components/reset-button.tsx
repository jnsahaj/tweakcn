import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface ResetButtonProps extends React.ComponentProps<typeof Button> {}

export function ResetButton({ className, ...props }: ResetButtonProps) {
  return (
    <TooltipWrapper label="Reset to preset defaults" asChild>
      <Button variant="ghost" size="sm" className={cn(className)} {...props}>
        <RefreshCw className="size-3.5" />
        <span className="hidden text-sm md:block">Reset</span>
      </Button>
    </TooltipWrapper>
  );
}
