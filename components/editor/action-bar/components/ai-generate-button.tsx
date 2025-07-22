import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIGenerateButtonProps {
  onClick: () => void;
}

export function AIGenerateButton({ onClick }: AIGenerateButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className="h-8 px-2 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
        >
          <Sparkles className="size-3.5" />
          <span className="text-sm hidden md:block animate-text bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[200%_auto] bg-clip-text text-transparent">
            Generate
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Generate theme with AI</TooltipContent>
    </Tooltip>
  );
}
