import { Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CodeButtonProps {
  onCodeClick: () => void;
}

export function CodeButton({ onCodeClick }: CodeButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 h-8 gap-1.5 px-2"
          onClick={onCodeClick}
        >
          <Braces className="size-3.5" />
          <span className="hidden text-sm md:block">Code</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>View theme code</TooltipContent>
    </Tooltip>
  );
}
