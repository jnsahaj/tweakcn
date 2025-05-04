import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import TabsTriggerPill from "../../theme-preview/tabs-trigger-pill";

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

const windsurfConfig = {
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
  const handleCopy = (config: typeof mcpConfig) => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 py-6 overflow-hidden rounded-lg border shadow-lg gap-6">
        <DialogHeader className="px-6">
          <DialogTitle>Setup MCP</DialogTitle>
          <DialogDescription>
            Use the code below to configure the registry in your IDE.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Tabs defaultValue="cursor" className="w-full">
            <TabsList className="inline-flex w-fit items-center justify-center rounded-full bg-background px-0 text-muted-foreground">
              <TabsTriggerPill value="cursor">Cursor</TabsTriggerPill>
              <TabsTriggerPill value="windsurf">Windsurf</TabsTriggerPill>
            </TabsList>
            <TabsContent value="cursor">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Copy and paste the code into{" "}
                  <span className="bg-muted rounded-md px-1">
                    .cursor/mcp.json
                  </span>
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-muted overflow-x-auto max-w-full">
                    <code className="block whitespace-pre-wrap break-all">
                      {JSON.stringify(mcpConfig, null, 2)}
                    </code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(mcpConfig)}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="windsurf">
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Copy and paste the code into{" "}
                  <span className="bg-muted rounded-md px-1">
                    .codeium/windsurf/mcp_config.json
                  </span>
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-muted overflow-x-auto max-w-full">
                    <code className="block whitespace-pre-wrap break-all">
                      {JSON.stringify(windsurfConfig, null, 2)}
                    </code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(windsurfConfig)}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
