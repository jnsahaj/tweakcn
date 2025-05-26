import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { Redo, Undo } from "lucide-react";

interface UndoRedoButtonsProps extends React.ComponentProps<typeof Button> {}

export function UndoRedoButtons({ disabled, ...props }: UndoRedoButtonsProps) {
  const { undo, redo, canUndo, canRedo } = useEditorStore();

  return (
    <div className="flex items-center gap-1">
      <TooltipWrapper label="Undo" asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || !canUndo()}
          {...props}
          onClick={undo}
        >
          <Undo className="h-4 w-4" />
        </Button>
      </TooltipWrapper>

      <TooltipWrapper label="Redo" asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || !canRedo()}
          {...props}
          onClick={redo}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </TooltipWrapper>
    </div>
  );
}
