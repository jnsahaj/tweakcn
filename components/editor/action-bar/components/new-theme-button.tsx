// Modified by Abtion: start a new theme from the app shell default (clears brand palettes and roles).
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { FilePlus } from "lucide-react";

export function NewThemeButton({ disabled }: { disabled?: boolean }) {
  const startNewTheme = useEditorStore((s) => s.startNewTheme);

  return (
    <AlertDialog>
      <TooltipWrapper label="Start a new theme" asChild>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" disabled={disabled}>
            <FilePlus className="size-3.5" />
            <span className="hidden text-sm md:block">New</span>
          </Button>
        </AlertDialogTrigger>
      </TooltipWrapper>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start a new theme?</AlertDialogTitle>
          <AlertDialogDescription>
            The editor goes back to the app shell default theme, and your brand palettes and role
            assignments are removed. Export the current theme first if you want to keep it. You can
            undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={startNewTheme}>New theme</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
