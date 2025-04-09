import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, PanelRight } from "lucide-react";
import { EditorConfig, ThemeEditorState } from "@/types/editor";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ColorFormat } from "../../types";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { usePostHog } from "posthog-js/react";
import { useEditorStore } from "@/store/editor-store";

interface CodePanelProps {
  config: EditorConfig;
  themeEditorState: ThemeEditorState;
  onCodePanelToggle: () => void;
}

const CodePanel: React.FC<CodePanelProps> = ({
  config,
  themeEditorState,
  onCodePanelToggle,
}) => {
  const [colorFormat, setColorFormat] = useState<ColorFormat>("oklch");
  const [tailwindVersion, setTailwindVersion] = useState<"3" | "4">("4");
  const [packageManager, setPackageManager] = useState<
    "pnpm" | "npm" | "yarn" | "bun"
  >("pnpm");
  const [registryCopied, setRegistryCopied] = useState(false);
  const code = config.codeGenerator.generateComponentCode(
    themeEditorState,
    colorFormat,
    tailwindVersion
  );
  const [copied, setCopied] = useState(false);
  const posthog = usePostHog();
  const preset = useEditorStore((state) => state.themeState.preset);

  const getRegistryCommand = (preset: string) => {
    const url = `https://tweakcn.com/r/themes/${preset}.json`;
    switch (packageManager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${url}`;
      case "npm":
        return `npx shadcn@latest add ${url}`;
      case "yarn":
        return `yarn dlx shadcn@latest add ${url}`;
      case "bun":
        return `bunx shadcn@latest add ${url}`;
    }
  };

  const copyRegistryCommand = async () => {
    try {
      await navigator.clipboard.writeText(getRegistryCommand(preset));
      setRegistryCopied(true);
      setTimeout(() => setRegistryCopied(false), 2000);
      captureCopyEvent("COPY_REGISTRY_COMMAND");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const captureCopyEvent = (event: string) => {
    posthog.capture(event, {
      editorType: "theme",
      preset,
      colorFormat,
      tailwindVersion,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      captureCopyEvent("COPY_CODE");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-none mb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Code</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCodePanelToggle}
            className="h-8 invisible md:visible group"
            title="Collapse Code Panel"
          >
            <PanelRight className="size-4 group-hover:scale-120 transition-all" />
          </Button>
        </div>
        {preset && preset !== "default" && (
          <div className="mt-4 rounded-md overflow-hidden border">
            <div className="flex border-b">
              {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPackageManager(pm)}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    packageManager === pm
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pm}
                </button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={copyRegistryCommand}
                className="h-8 ml-auto"
                aria-label={
                  registryCopied ? "Copied to clipboard" : "Copy to clipboard"
                }
              >
                {registryCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <div className="p-2 bg-muted/50 flex justify-between items-center">
              <ScrollArea className="w-full">
                <div className="whitespace-nowrap overflow-y-hidden pb-2">
                  <code className="text-sm font-mono">
                    {getRegistryCommand(preset)}
                  </code>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4 ">
        <Select
          value={tailwindVersion}
          onValueChange={(value: "3" | "4") => {
            setTailwindVersion(value);
            setColorFormat(value === "4" ? "oklch" : "hsl");
          }}
        >
          <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-hidden border-none gap-1">
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
          <SelectTrigger className="w-fit focus:ring-transparent focus:border-none bg-muted/50 outline-hidden border-none gap-1">
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

      <div className="flex-1 min-h-0 flex flex-col rounded-lg border overflow-hidden">
        <div className="flex-none flex justify-between items-center px-4 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">index.css</span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(code)}
              className="h-8"
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span className="sr-only md:not-sr-only">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span className="sr-only md:not-sr-only">Copy</span>
                </>
              )}
            </Button>
          </div>
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
