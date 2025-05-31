import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogPost } from "./blog-post";
import { DemoFontShowcase } from "./font-showcase";

export default function TypographyDemo() {
  return (
    <div className="@container relative grid grid-cols-9 gap-4">
      <div className="sticky top-6 hidden max-h-120 overflow-hidden overflow-y-auto lg:col-span-3 lg:block">
        <ScrollArea className="h-full">
          <DemoFontShowcase />
        </ScrollArea>
      </div>
      <div className="col-span-9 lg:col-span-6">
        <BlogPost />
      </div>
    </div>
  );
}
