import { Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "@/components/tooltip-wrapper";

interface CodeButtonProps extends React.ComponentProps<typeof Button> {}

export function CodeButton({ className, ...props }: CodeButtonProps) {
  return (
    <TooltipWrapper label="View theme code" asChild>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-muted-foreground hover:text-foreground hover:bg-accent/50 h-8 gap-1.5 px-2",
          className
        )}
        {...props}
      >
        <Braces className="size-3.5" />
        <span className="hidden text-sm md:block">Code</span>
      </Button>
    </TooltipWrapper>
  );
}
