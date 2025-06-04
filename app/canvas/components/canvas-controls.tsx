import { Button } from "@/components/ui/button";
import { MousePointer, Square } from "lucide-react";

interface CanvasControlsProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onToggleSelectionMode: () => void;
}

export function CanvasControls({
  isSelectionMode,
  selectedCount,
  onToggleSelectionMode,
}: CanvasControlsProps) {
  return (
    <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2 transform">
      <div className="bg-card/95 flex items-center gap-2 rounded-lg border p-2 backdrop-blur-sm">
        <Button
          variant={isSelectionMode ? "default" : "outline"}
          size="sm"
          onClick={onToggleSelectionMode}
          className="flex items-center gap-2"
        >
          {isSelectionMode ? (
            <>
              <Square className="h-4 w-4" />
              Selection Mode
            </>
          ) : (
            <>
              <MousePointer className="h-4 w-4" />
              Pan Mode
            </>
          )}
        </Button>
        {selectedCount > 1 && (
          <span className="text-muted-foreground text-sm">{selectedCount} components selected</span>
        )}
      </div>
    </div>
  );
}
