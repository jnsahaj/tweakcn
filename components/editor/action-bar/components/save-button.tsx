import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Loader2 } from "lucide-react";

interface SaveButtonProps extends React.ComponentProps<typeof Button> {
  isSaving: boolean;
}

export function SaveButton({ isSaving, disabled, className, ...props }: SaveButtonProps) {
  return (
    <TooltipWrapper label="Save theme" asChild>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-muted-foreground hover:text-foreground hover:bg-accent/50 h-8 gap-1.5 px-2",
          className
        )}
        disabled={isSaving || disabled}
        {...props}
      >
        {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Heart className="size-3.5" />}
        <span className="hidden text-sm md:block">Save</span>
      </Button>
    </TooltipWrapper>
  );
}
