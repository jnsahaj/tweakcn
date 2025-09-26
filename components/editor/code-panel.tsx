import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/base-ui-tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDialogActions } from "@/hooks/use-dialog-actions";
import { useEditorStore } from "@/store/editor-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { ColorFormat } from "@/types";
import { ThemeEditorState } from "@/types/editor";
import {
  generateTailwindConfigFileCode,
  generateThemeCode,
  GenerateVarsPreferences,
} from "@/utils/theme-style-generator";
import { Check, Copy, Heart, Settings } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useMemo, useState } from "react";

interface CodePanelProps {
  themeEditorState: ThemeEditorState;
}

const EXPORT_CODE_TABS = {
  CSS_CODE: "css-code",
  TAILWIND_CONFIG_CODE: "tailwind-config-code",
};

const CodePanel: React.FC<CodePanelProps> = ({ themeEditorState }) => {
  const [registryCopied, setRegistryCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(EXPORT_CODE_TABS.CSS_CODE);
  const [copied, setCopied] = useState(false);
  const posthog = usePostHog();
  const { handleSaveClick } = useDialogActions();

  const preset = useEditorStore((state) => state.themeState.preset);
  const colorFormat = usePreferencesStore((state) => state.colorFormat);
  const tailwindVersion = usePreferencesStore((state) => state.tailwindVersion);
  const includeFontVariables = usePreferencesStore((state) => state.includeFontVariables);
  const packageManager = usePreferencesStore((state) => state.packageManager);
  const setColorFormat = usePreferencesStore((state) => state.setColorFormat);
  const setTailwindVersion = usePreferencesStore((state) => state.setTailwindVersion);
  const setIncludeFontVariables = usePreferencesStore((state) => state.setIncludeFontVariables);
  const setPackageManager = usePreferencesStore((state) => state.setPackageManager);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);

  const isSavedPreset = useThemePresetStore(
    (state) => preset && state.getPreset(preset)?.source === "SAVED"
  );
  const getAvailableColorFormats = usePreferencesStore((state) => state.getAvailableColorFormats);

  const preferences: GenerateVarsPreferences = {
    includeFontVariables,
  };

  const code = generateThemeCode(themeEditorState, colorFormat, tailwindVersion, preferences);
  const configCode = generateTailwindConfigFileCode(themeEditorState, preferences);

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

  // Auto-switch to CSS file when switching from v3 to v4
  useEffect(() => {
    if (tailwindVersion === "4" && activeTab === EXPORT_CODE_TABS.TAILWIND_CONFIG_CODE) {
      setActiveTab(EXPORT_CODE_TABS.CSS_CODE);
    }
  }, [tailwindVersion, activeTab]);

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
    <div className="isolate flex h-full flex-col">
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
                  className="ml-auto size-8"
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
      <div className="relative isolate mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select
            value={tailwindVersion}
            onValueChange={(value: "3" | "4") => {
              setTailwindVersion(value);
              if (value === "4" && colorFormat === "hsl") {
                setColorFormat("oklch");
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm max-md:w-8">
              <Settings />
              <span className="sr-only md:not-sr-only">Preferences</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="z-99999 w-[300px] space-y-2">
            <div className="flex justify-between gap-4 rounded-lg">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Include font variables</span>
                <span className="text-muted-foreground text-xs text-pretty">
                  If you handle fonts separately, turn this OFF.
                </span>
              </div>
              <Switch
                className="ml-auto shrink-0"
                checked={includeFontVariables}
                onCheckedChange={(checked) => setIncludeFontVariables(checked)}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue={EXPORT_CODE_TABS.CSS_CODE}
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border"
      >
        <div className="bg-muted/50 flex flex-none items-center justify-between border-b px-4 py-2">
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger value={EXPORT_CODE_TABS.CSS_CODE} className="h-8 px-2 text-sm font-medium">
              index.css
            </TabsTrigger>
            {tailwindVersion === "3" && (
              <TabsTrigger
                value={EXPORT_CODE_TABS.TAILWIND_CONFIG_CODE}
                className="h-8 px-2 text-sm font-medium"
              >
                tailwind.config.ts
              </TabsTrigger>
            )}
            <TabsIndicator className="bg-background rounded-sm" />
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(activeTab === EXPORT_CODE_TABS.CSS_CODE ? code : configCode)
              }
              className="h-8 max-md:w-8"
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

        <TabsContent value={EXPORT_CODE_TABS.CSS_CODE} className="overflow-hidden">
          <ScrollArea className="relative h-full">
            <pre className="h-full p-4 text-sm">
              <code>{code}</code>
            </pre>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>

        {tailwindVersion === "3" && (
          <TabsContent value={EXPORT_CODE_TABS.TAILWIND_CONFIG_CODE} className="overflow-hidden">
            <ScrollArea className="relative h-full">
              <pre className="h-full p-4 text-sm">
                <code>{configCode}</code>
              </pre>
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CodePanel;
