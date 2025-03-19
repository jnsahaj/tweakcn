import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { EditorConfig } from "@/types/editor";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ThemeStyles } from "../../types/theme";
import { ColorFormat } from "../../types";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { ButtonStyles } from "@/types/button";

interface CodePanelProps {
  config: EditorConfig;
  styles: ThemeStyles | ButtonStyles;
}

const CodePanel: React.FC<CodePanelProps> = ({ config, styles }) => {
  const { type: editorType } = config;
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hsl");
  const [tailwindVersion, setTailwindVersion] = useState<"3" | "4">("3");
  const code = config.codeGenerator.generateComponentCode(styles, colorFormat, tailwindVersion);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const getFileName = () => {
    switch (editorType) {
      case "button":
        return "button.tsx";
      case "theme":
        return "index.css";
      default:
        return "index.tsx";
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-none px-2 mb-4">
        <h2 className="text-lg font-semibold">Code</h2>
      </div>
      {editorType === "theme" && (
        <div className="flex items-center gap-2 mb-4 ">
          <Select
            value={tailwindVersion}
            onValueChange={(value: "3" | "4") => {
              setTailwindVersion(value)
              setColorFormat(value === "4" ? "oklch" : "hsl")
            }}
          >
            <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-none border-none gap-1">
              <SelectValue className="focus:ring-transparent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Tailwind v3</SelectItem>
              <SelectItem value="4">Tailwind v4</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={colorFormat}
            onValueChange={(value: ColorFormat) => setColorFormat(value)}
          >
            <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-none border-none gap-1">
              <SelectValue className="focus:ring-transparent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hsl">hsl</SelectItem>
              <SelectItem value="oklch">oklch</SelectItem>
              <SelectItem value="rgb">rgb</SelectItem>
              <SelectItem value="hex">hex</SelectItem>
            </SelectContent>
          </Select>

        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col rounded-lg border overflow-hidden">
        <div className="flex-none flex justify-between items-center px-4 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">{getFileName()}</span>


          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code)}
            className="h-8 px-2"
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                <span className="sr-only md:not-sr-only">Copy</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                <span className="sr-only md:not-sr-only">Copy</span>
              </>
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 relative">
          <pre className="h-full p-4 text-sm">
            <code>{code}</code>
          </pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodePanel;
