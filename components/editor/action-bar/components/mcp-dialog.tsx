import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/ui/base-ui-tabs";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/revola";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";
import { usePostHog } from "posthog-js/react";

interface MCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mcpConfig = {
  mcpServers: {
    shadcn: {
      command: "npx",
      args: ["-y", "shadcn@canary", "registry:mcp"],
      env: {
        REGISTRY_URL: "https://tweakcn.com/r/themes/registry.json",
      },
    },
  },
};

export function MCPDialog({ open, onOpenChange }: MCPDialogProps) {
  const { hasCopied, copyToClipboard } = useCopyToClipboard();
  const posthog = usePostHog();

  const handleCopy = async (config: typeof mcpConfig) => {
    copyToClipboard(JSON.stringify(config, null, 2));
    posthog.capture("COPY_MCP_SETUP");
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex max-h-[90dvh] flex-col overflow-hidden shadow-lg sm:w-[calc(100%-2rem)] sm:max-w-2xl">
        <div className="space-y-6 p-6 pt-0 sm:p-6">
          <ResponsiveDialogHeader className="text-left">
            <ResponsiveDialogTitle>Setup MCP</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Use the code below to configure the registry in your IDE.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <Tabs defaultValue="cursor">
            <TabsList className="bg-background mb-2 inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTrigger
                className="data-selected:text-secondary-foreground hover:text-muted-foreground/70 rounded-full"
                value="cursor"
              >
                Cursor
              </TabsTrigger>
              <TabsTrigger
                className="data-selected:text-secondary-foreground hover:text-muted-foreground/70 rounded-full"
                value="windsurf"
              >
                Windsurf
              </TabsTrigger>
              <TabsIndicator />
            </TabsList>

            <div className="rounded-lg border">
              <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-2">
                <TabsContent value="cursor" className="contents">
                  <p className="text-muted-foreground text-sm font-medium">
                    Copy and paste the code into{" "}
                    <span className="bg-muted text-foreground rounded-md px-1">
                      .cursor/mcp.json
                    </span>
                  </p>
                </TabsContent>
                <TabsContent value="windsurf" className="contents">
                  <p className="text-muted-foreground text-sm font-medium">
                    Copy and paste the code into{" "}
                    <span className="bg-muted text-foreground rounded-md px-1">
                      .codeium/windsurf/mcp_config.json
                    </span>
                  </p>
                </TabsContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(mcpConfig)}
                  className="h-8"
                  aria-label={hasCopied ? "Copied to clipboard" : "Copy to clipboard"}
                >
                  {hasCopied ? (
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

              <pre className="size-full overflow-auto p-4 text-sm">
                <code>{JSON.stringify(mcpConfig, null, 2)}</code>
              </pre>
            </div>
          </Tabs>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
