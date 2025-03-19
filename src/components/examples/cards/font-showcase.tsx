import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Code, Type } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoFontShowcase() {
  return (
    <Card>
      <CardContent className="grid gap-4 pt-6">
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
            <p className="font-semibold">const hello = "world";</p>
            <pre className="text-muted-foreground">
              {`function greet() {`}
              <br />
              {`  console.log("hello world");`}
              <br />
              {`}`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
