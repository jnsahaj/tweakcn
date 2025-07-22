import { BlogPost } from "./blog-post";
import { DemoFontShowcase } from "./font-showcase";

export default function TypographyDemo() {
  return (
    <div className="@container relative grid grid-cols-9 gap-4 p-4">
      <div className="sticky top-4 hidden size-full max-h-140 overflow-hidden lg:col-span-3 lg:block">
        <DemoFontShowcase />
      </div>
      <div className="col-span-9 lg:col-span-6">
        <BlogPost />
      </div>
    </div>
  );
}
