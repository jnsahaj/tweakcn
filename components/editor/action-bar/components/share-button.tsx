import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Share2 } from "lucide-react";

interface ShareButtonProps extends React.ComponentProps<typeof Button> {
  isSharing?: boolean;
}

export function ShareButton({
  onClick,
  isSharing,
  disabled,
  className,
  ...props
}: ShareButtonProps) {
  return (
    <TooltipWrapper label="Share theme" asChild>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-muted-foreground hover:text-foreground hover:bg-accent/50 h-8 gap-1.5 px-2",
          className
        )}
        onClick={onClick}
        disabled={isSharing || disabled}
        {...props}
      >
        {isSharing ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Share2 className="size-3.5" />
        )}
        <span className="hidden text-sm md:block">Share</span>
      </Button>
    </TooltipWrapper>
  );
}
