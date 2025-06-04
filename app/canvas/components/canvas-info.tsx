import { Badge } from "@/components/ui/badge";
import { GRID_SIZE } from "../utils/grid-utils";

interface CanvasInfoProps {
  componentCount: number;
}

export function CanvasInfo({ componentCount }: CanvasInfoProps) {
  return (
    <div className="absolute right-4 bottom-4 z-10">
      <Badge variant="secondary" className="bg-card/95 backdrop-blur-sm">
        Components: {componentCount} | Grid: {GRID_SIZE}px
      </Badge>
    </div>
  );
}
