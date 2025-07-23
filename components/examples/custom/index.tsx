import { DynamicBlockViewer } from "@/components/dynamic-block-viewer";

export default function CustomDemo() {
  // If you want to use the direct injection in the same origin (localhost:3000), you can do it like this:
  // return <DynamicBlockViewer name="Custom Website Preview" useDirectInjection />;

  return <DynamicBlockViewer name="Custom Website Preview" />;
}
