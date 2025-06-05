"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2 } from "lucide-react";

interface GroupPropertiesSidebarProps {
  selectedCount: number;
  onDuplicateComponents: () => void;
  onDeleteComponents: () => void;
}

export function GroupPropertiesSidebar({
  selectedCount,
  onDuplicateComponents,
  onDeleteComponents,
}: GroupPropertiesSidebarProps) {
  const handleDuplicateComponents = () => {
    onDuplicateComponents();
  };

  const handleDeleteComponents = () => {
    onDeleteComponents();
  };

  return (
    <div className="absolute top-4 right-4 z-10 w-80">
      <Card className="bg-background/95 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Group Selection ({selectedCount} items)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Actions Section */}
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Actions
            </h4>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDuplicateComponents}
                className="h-8 w-8 p-0"
                title="Duplicate Selected Components"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteComponents}
                className="h-8 w-8 p-0"
                title="Delete Selected Components"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
