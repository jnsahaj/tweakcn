import CodePanel from "./code-panel";
import { ThemeEditorState } from "@/types/editor";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/revola";

interface CodePanelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeEditorState: ThemeEditorState;
}

export function CodePanelDialog({ open, onOpenChange, themeEditorState }: CodePanelDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="h-[90dvh] max-h-[90dvh] overflow-hidden shadow-lg sm:h-[80dvh] sm:w-[calc(100%-2rem)] sm:max-w-4xl sm:py-6">
        <div className="h-full space-y-6 overflow-auto px-6">
          <ResponsiveDialogHeader className="sr-only">
            <ResponsiveDialogTitle>Theme Code</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              View and copy the code for your theme.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <CodePanel themeEditorState={themeEditorState} />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
