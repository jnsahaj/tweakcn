import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
  zoomState: {
    scale: number;
    minScale: number;
    maxScale: number;
  };
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function ZoomControls({ zoomState, onZoomIn, onZoomOut, onResetZoom }: ZoomControlsProps) {
  const zoomPercentage = Math.round(zoomState.scale * 100);

  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
      <Badge variant="secondary" className="bg-card/95 px-3 py-1.5 backdrop-blur-sm">
        {zoomPercentage}%
      </Badge>

      <div className="bg-card/95 flex items-center gap-1 rounded-md border p-1 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={zoomState.scale <= zoomState.minScale}
          className="h-7 w-7 p-0"
          title="Zoom Out (Ctrl + Mouse Wheel)"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onResetZoom}
          className="h-7 w-7 p-0"
          title="Reset Zoom (100%)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={zoomState.scale >= zoomState.maxScale}
          className="h-7 w-7 p-0"
          title="Zoom In (Ctrl + Mouse Wheel)"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
