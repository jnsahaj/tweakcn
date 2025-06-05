import { Badge } from "@/components/ui/badge";
import { useCanvasStore } from "@/store/canvas-store";

interface CanvasInfoProps {
  componentCount: number;
  zoomScale: number;
}

export function CanvasInfo({ componentCount, zoomScale }: CanvasInfoProps) {
  const gridSize = useCanvasStore((state) => state.gridSize);
  const zoomPercentage = Math.round(zoomScale * 100);

  return (
    <div className="absolute right-4 bottom-4 z-10">
      <Badge variant="secondary" className="bg-card/95 backdrop-blur-sm">
        Components: {componentCount} | Grid: {gridSize}px | Zoom: {zoomPercentage}%
      </Badge>
    </div>
  );
}
