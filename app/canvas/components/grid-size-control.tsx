"use client";

import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useCanvasStore } from "@/store/canvas-store";

export function GridSizeControl() {
  const { gridSize, setGridSize } = useCanvasStore();

  const handleValueChange = (values: number[]) => {
    setGridSize(values[0]);
  };

  return (
    <div className="bg-card/95 absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-md border p-3 shadow-sm backdrop-blur-sm">
      <Badge variant="outline" className="font-mono text-xs">
        Grid: {gridSize}px
      </Badge>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">2px</span>
        <Slider
          value={[gridSize]}
          onValueChange={handleValueChange}
          min={2}
          max={16}
          step={2}
          className="w-24"
        />
        <span className="text-muted-foreground text-xs">16px</span>
      </div>
    </div>
  );
}
