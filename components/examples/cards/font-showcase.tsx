import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DemoFontShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Font Showcase</CardTitle>
        <CardDescription>View theme fonts in different styles</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Sans-Serif</h3>
          <div className="font-sans space-y-1">
            <div className="text-xl font-light">Light Weight Text</div>
            <div className="text-xl">Regular Weight Text</div>
            <div className="text-xl font-medium">Medium Weight Text</div>
            <div className="text-xl font-semibold">Semibold Weight Text</div>
            <div className="text-xl font-bold">Bold Weight Text</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Serif</h3>
          <div className="font-serif space-y-1">
            <div className="text-xl font-light">Light Weight Text</div>
            <div className="text-xl">Regular Weight Text</div>
            <div className="text-xl font-medium">Medium Weight Text</div>
            <div className="text-xl font-semibold">Semibold Weight Text</div>
            <div className="text-xl font-bold">Bold Weight Text</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Monospace</h3>
          <div className="font-mono space-y-1">
            <div className="text-xl font-light">Light Weight Text</div>
            <div className="text-xl">Regular Weight Text</div>
            <div className="text-xl font-medium">Medium Weight Text</div>
            <div className="text-xl font-semibold">Semibold Weight Text</div>
            <div className="text-xl font-bold">Bold Weight Text</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
