import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SaveButtonProps {
  onSaveClick: () => void;
  isSaving: boolean;
}

export function SaveButton({ onSaveClick, isSaving }: SaveButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 h-8 gap-1.5 px-2"
          onClick={onSaveClick}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Heart className="size-3.5" />
          )}
          <span className="hidden text-sm md:block">Save</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Save theme</TooltipContent>
    </Tooltip>
  );
}
