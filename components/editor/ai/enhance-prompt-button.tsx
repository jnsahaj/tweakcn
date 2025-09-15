import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleStop, WandSparkles } from "lucide-react";

interface EnhancePromptButtonProps extends React.ComponentProps<typeof Button> {
  isEnhancing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function EnhancePromptButton({
  className,
  disabled,
  isEnhancing,
  onStart,
  onStop,
  ...props
}: EnhancePromptButtonProps) {
  return (
    <TooltipWrapper label={isEnhancing ? "Stop" : "Enhance prompt"} asChild>
      <Button
        size="icon"
        variant={isEnhancing ? "destructive" : "outline"}
        className={cn("relative size-8 shadow-none", className)}
        onClick={isEnhancing ? onStop : onStart}
        disabled={disabled}
        {...props}
      >
        {isEnhancing ? <CircleStop /> : <WandSparkles />}
      </Button>
    </TooltipWrapper>
  );
}
