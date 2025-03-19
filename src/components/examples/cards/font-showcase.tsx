
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Type } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoFontShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Typography Showcase
        </CardTitle>
        <CardDescription>
          Examples of different font families available in the theme
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Type className="h-4 w-4" />
            <span>Serif Font</span>
          </div>
          <div className="rounded-md border p-4 font-serif">
            <p className="text-xl font-semibold">The quick brown fox</p>
            <p className="text-muted-foreground">
              Typography is the art and technique of arranging type to make written language
              legible, readable, and appealing when displayed.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code className="h-4 w-4" />
            <span>Monospace Font</span>
          </div>
          <div className={cn("rounded-md border bg-muted p-4 font-mono")}>
            <p className="text-xl font-semibold">const hello = "world";</p>
            <p className="text-muted-foreground">
              function greet() {
              <br />
              &nbsp;&nbsp;return "Hello, developer!";
              <br />
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
