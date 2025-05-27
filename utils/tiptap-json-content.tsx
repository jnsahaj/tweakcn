import { JSONContent } from "@tiptap/react";

export const getTextContent = (jsonContent: JSONContent | null) => {
  if (!jsonContent) return "";
  // Extract text content from JSON structure
  return (
    jsonContent.content?.[0]?.content?.reduce((text: string, node: any) => {
      if (node.type === "text") return text + node.text;
      if (node.type === "mention") return text + `@${node.attrs?.label}`;
      return text;
    }, "") || ""
  );
};

export const mentionsCount = (jsonContent: JSONContent | null) => {
  if (!jsonContent) return 0;
  return (
    jsonContent.content?.[0]?.content?.filter((node: any) => node.type === "mention").length || 0
  );
};
