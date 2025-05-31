import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DemoFontShowcase() {
  return (
    <Card className="flex flex-1 flex-col">
      <CardHeader>
        <CardTitle>Font Showcase</CardTitle>
        <CardDescription>View theme fonts in different styles</CardDescription>
      </CardHeader>
      <CardContent className="flex-coloverflow-hidden flex flex-1 px-0">
        <ScrollArea className="flex size-full max-h-100 flex-1 flex-col px-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-muted-foreground mb-2 text-lg font-semibold">Sans-Serif</h3>
              <div className="space-y-1 font-sans">
                <div className="text-normal line-clamp-1 font-light">Light Weight Text</div>
                <div className="text-normal line-clamp-1">Regular Weight Text</div>
                <div className="text-normal line-clamp-1 font-medium">Medium Weight Text</div>
                <div className="text-normal line-clamp-1 font-semibold">Semibold Weight Text</div>
                <div className="text-normal line-clamp-1 font-bold">Bold Weight Text</div>
              </div>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-2 text-lg font-semibold">Serif</h3>
              <div className="space-y-1 font-serif">
                <div className="text-normal line-clamp-1 font-light">Light Weight Text</div>
                <div className="text-normal line-clamp-1">Regular Weight Text</div>
                <div className="text-normal line-clamp-1 font-medium">Medium Weight Text</div>
                <div className="text-normal line-clamp-1 font-semibold">Semibold Weight Text</div>
                <div className="text-normal line-clamp-1 font-bold">Bold Weight Text</div>
              </div>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-2 text-lg font-semibold">Monospace</h3>
              <div className="space-y-1 font-mono">
                <div className="text-normal line-clamp-1 font-light">Light Weight Text</div>
                <div className="text-normal line-clamp-1">Regular Weight Text</div>
                <div className="text-normal line-clamp-1 font-medium">Medium Weight Text</div>
                <div className="text-normal line-clamp-1 font-semibold">Semibold Weight Text</div>
                <div className="text-normal line-clamp-1 font-bold">Bold Weight Text</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
