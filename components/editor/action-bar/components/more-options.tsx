import McpIcon from "@/assets/mcp.svg";
import ContrastChecker from "@/components/editor/contrast-checker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "@/store/editor-store";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { MCPDialog } from "./mcp-dialog";

interface MoreOptionsProps extends React.ComponentProps<typeof DropdownMenuTrigger> {}

export function MoreOptions({ ...props }: MoreOptionsProps) {
  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const { themeState } = useEditorStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild {...props}>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-foreground">
          <DropdownMenuItem onClick={() => setMcpDialogOpen(true)} asChild>
            <span className="w-full justify-start flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer">
              <McpIcon className="h-4 w-4" />
              <span className="text-sm">MCP</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <ContrastChecker currentStyles={themeState.styles[themeState.currentMode]} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MCPDialog open={mcpDialogOpen} onOpenChange={setMcpDialogOpen} />
    </>
  );
}
