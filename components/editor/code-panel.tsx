import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Heart } from "lucide-react";
import { ThemeEditorState } from "@/types/editor";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CodeBlock } from "@/components/ai-elements/code-block";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
} from "@/components/ui/base-ui-tabs";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { usePostHog } from "posthog-js/react";
import { useEditorStore } from "@/store/editor-store";
import { usePreferencesStore } from "@/store/preferences-store";
import {
  generateThemeCode,
  generateTailwindConfigCode,
  generateLayoutCode,
} from "@/utils/theme-style-generator";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { useDialogActions } from "@/hooks/use-dialog-actions";
import { ColorFormat } from "@/types";

interface CodePanelProps {
  themeEditorState: ThemeEditorState;
}

const CodePanel: React.FC<CodePanelProps> = ({ themeEditorState }) => {
  const [registryCopied, setRegistryCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("index.css");
  const posthog = usePostHog();
  const { handleSaveClick } = useDialogActions();

  const preset = useEditorStore((state) => state.themeState.preset);
  const colorFormat = usePreferencesStore((state) => state.colorFormat);
  const tailwindVersion = usePreferencesStore((state) => state.tailwindVersion);
  const packageManager = usePreferencesStore((state) => state.packageManager);
  const setColorFormat = usePreferencesStore((state) => state.setColorFormat);
  const setTailwindVersion = usePreferencesStore((state) => state.setTailwindVersion);
  const setPackageManager = usePreferencesStore((state) => state.setPackageManager);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);

  const isSavedPreset = useThemePresetStore(
    (state) => preset && state.getPreset(preset)?.source === "SAVED"
  );
  const getAvailableColorFormats = usePreferencesStore((state) => state.getAvailableColorFormats);

  const code = generateThemeCode(themeEditorState, colorFormat, tailwindVersion);
  const configCode = generateTailwindConfigCode(themeEditorState, colorFormat, tailwindVersion);
  const layoutCode = generateLayoutCode(themeEditorState);

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
      await navigator.clipboard.writeText(getRegistryCommand(preset ?? "default"));
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

  const PackageManagerHeader = ({ actionButton }: { actionButton: React.ReactNode }) => (
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
      {actionButton}
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex-none">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Theme Code</h2>
        </div>
        <div className="mt-4 overflow-hidden rounded-md border">
          <PackageManagerHeader
            actionButton={
              showRegistryCommand ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyRegistryCommand}
                  className="ml-auto h-8"
                  aria-label={registryCopied ? "Copied to clipboard" : "Copy to clipboard"}
                >
                  {registryCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveClick()}
                  className="ml-auto h-8 gap-1"
                  aria-label="Save theme"
                >
                  <Heart className="size-4" />
                  <span className="sr-only sm:not-sr-only">Save</span>
                </Button>
              )
            }
          />
          <div className="bg-muted/50 flex items-center justify-between p-2">
            {showRegistryCommand ? (
              <ScrollArea className="w-full">
                <div className="overflow-y-hidden pb-2 whitespace-nowrap">
                  <code className="font-mono text-sm">{getRegistryCommand(preset as string)}</code>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="text-muted-foreground text-sm">
                Save your theme to get the registry command
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <Select
          value={tailwindVersion}
          onValueChange={(value: "3" | "4") => {
            setTailwindVersion(value);
            if (value === "4" && colorFormat === "hsl") {
              setColorFormat("oklch");
            }
            if (activeTab === "tailwind.config.ts") {
              setActiveTab("index.css");
            }
          }}
        >
          <SelectTrigger className="bg-muted/50 w-fit gap-1 border-none outline-hidden focus:border-none focus:ring-transparent">
            <SelectValue className="focus:ring-transparent" />
          </SelectTrigger>
          <SelectContent className="z-99999">
            <SelectItem value="3">Tailwind v3</SelectItem>
            <SelectItem value="4">Tailwind v4</SelectItem>
          </SelectContent>
        </Select>
        <Select value={colorFormat} onValueChange={(value: ColorFormat) => setColorFormat(value)}>
          <SelectTrigger className="bg-muted/50 w-fit gap-1 border-none outline-hidden focus:border-none focus:ring-transparent">
            <SelectValue className="focus:ring-transparent" />
          </SelectTrigger>
          <SelectContent className="z-99999">
            {getAvailableColorFormats().map((colorFormat) => (
              <SelectItem key={colorFormat} value={colorFormat}>
                {colorFormat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="index.css"
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border"
      >
        <div className="bg-muted/50 flex flex-none items-center justify-between border-b px-4 py-2">
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger value="index.css" className="h-7 px-3 text-sm font-medium">
              index.css
            </TabsTrigger>
            {tailwindVersion === "3" && (
              <TabsTrigger value="tailwind.config.ts" className="h-7 px-3 text-sm font-medium">
                tailwind.config.ts
              </TabsTrigger>
            )}
            <TabsTrigger value="layout.tsx" className="h-7 px-3 text-sm font-medium">
              layout.tsx (Next.js)
            </TabsTrigger>
            <TabsIndicator className="bg-background rounded-sm" />
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  activeTab === "index.css"
                    ? code
                    : activeTab === "layout.tsx"
                      ? layoutCode
                      : configCode
                )
              }
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

        <TabsContent value="index.css" className="overflow-hidden">
          <ScrollArea className="relative h-full">
            <CodeBlock code={code} language="css" className="h-full rounded-none border-0" />
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>

        {tailwindVersion === "3" && (
          <TabsContent value="tailwind.config.ts" className="overflow-hidden">
            <ScrollArea className="relative h-full">
              <CodeBlock
                code={configCode}
                language="typescript"
                className="h-full rounded-none border-0"
              />
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="layout.tsx" className="overflow-hidden">
          <ScrollArea className="relative h-full">
            <CodeBlock
              code={layoutCode}
              language="tsx"
              className="h-full rounded-none border-0"
            />
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodePanel;
