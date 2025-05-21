import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Heart } from "lucide-react";
import { ThemeEditorState } from "@/types/editor";
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
import { usePreferencesStore } from "@/store/preferences-store";
import { generateThemeCode } from "@/utils/theme-style-generator";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface CodePanelProps {
  themeEditorState: ThemeEditorState;
}

const CodePanel: React.FC<CodePanelProps> = ({ themeEditorState }) => {
  const [registryCopied, setRegistryCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  const posthog = usePostHog();

  const preset = useEditorStore((state) => state.themeState.preset);
  const colorFormat = usePreferencesStore((state) => state.colorFormat);
  const tailwindVersion = usePreferencesStore((state) => state.tailwindVersion);
  const packageManager = usePreferencesStore((state) => state.packageManager);
  const setColorFormat = usePreferencesStore((state) => state.setColorFormat);
  const setTailwindVersion = usePreferencesStore(
    (state) => state.setTailwindVersion
  );
  const setPackageManager = usePreferencesStore(
    (state) => state.setPackageManager
  );
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);

  const isSavedPreset = useThemePresetStore(
    (state) => preset && state.getPreset(preset)?.source === "SAVED"
  );

  const code = generateThemeCode(
    themeEditorState,
    colorFormat,
    tailwindVersion
  );

  const getRegistryCommand = (preset: string) => {
    const url = isSavedPreset
      ? `https://tweakcn.com/r/themes/${preset}`
      : `https://tweakcn.com/r/themes/${preset}.json`;
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
      await navigator.clipboard.writeText(
        getRegistryCommand(preset ?? "default")
      );
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

  const showRegistryCommand = useMemo(() => {
    return preset && preset !== "default" && !hasUnsavedChanges();
  }, [preset, hasUnsavedChanges]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none mb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Theme Code</h2>
        </div>
        {showRegistryCommand ? (
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
                    {getRegistryCommand(preset as string)}
                  </code>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        ) : (
          <Alert className="mt-4">
            <AlertTitle>You have unsaved changes.</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 px-2 py-0.5 border rounded-md">
                  <Heart className="size-3.5" />
                  <span>Save</span>
                </div>
                your theme to get the registry command.
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4 ">
        <Select
          value={tailwindVersion}
          onValueChange={(value: "3" | "4") => {
            setTailwindVersion(value);
            if (value === "4" && colorFormat === "hsl") {
              setColorFormat("oklch");
            }
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
            {tailwindVersion === "4" && <SelectItem value="oklch">oklch</SelectItem>}
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
