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

export function createCurrentThemePromptJson({ prompt }: { prompt: string }): JSONContent {
  // Define the mention node structure
  const mentionNode: JSONContent = {
    type: "mention",
    attrs: {
      id: "editor:current-changes",
      label: "Current Theme",
    },
  };

  // Define the text parts
  const textPart1: JSONContent = {
    type: "text",
    text: "Make the following changes based on ",
  };
  const textPart2: JSONContent = {
    type: "text",
    text: ":\n",
  };
  const textPart3: JSONContent = {
    type: "text",
    text: prompt,
  };

  // Combine into a paragraph
  const paragraphNode: JSONContent = {
    type: "paragraph",
    content: [textPart1, mentionNode, textPart2, textPart3],
  };

  // Combine into the top-level document
  const docNode: JSONContent = {
    type: "doc",
    content: [paragraphNode],
  };

  return docNode;
}
