import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useThemeActions } from "@/hooks/use-theme-actions";
import { useEditorStore } from "@/store/editor-store";
import { Theme } from "@/types/theme";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeSaveDialog } from "./theme-save-dialog";

interface ThemeEditActionsProps {
  theme: Theme;
  disabled?: boolean;
}

const ThemeEditActions: React.FC<ThemeEditActionsProps> = ({ theme, disabled = false }) => {
  const router = useRouter();
  const { updateTheme } = useThemeActions();
  const { themeState, applyThemePreset } = useEditorStore();
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeEditCancel = () => {
    router.push("/editor/theme");
    applyThemePreset(themeState?.preset || "default");
  };

  const handleSaveTheme = async (newName: string) => {
    setIsSaving(true);
    const dataToUpdate: {
      id: string;
      name?: string;
      styles?: Theme["styles"];
    } = {
      id: theme.id,
    };

    if (newName !== theme.name) {
      dataToUpdate.name = newName;
    } else {
      dataToUpdate.name = theme.name;
    }

    if (themeState.styles) {
      dataToUpdate.styles = themeState.styles;
    }

    if (!dataToUpdate.name && !dataToUpdate.styles) {
      setIsNameDialogOpen(false);
      setIsSaving(false);
      return;
    }

    const result = await updateTheme(dataToUpdate);
    setIsSaving(false);

    if (result) {
      setIsNameDialogOpen(false);
      router.push("/editor/theme");
      applyThemePreset(result?.id || themeState?.preset || "default");
    } else {
      console.error("Failed to update theme");
    }
  };

  const handleThemeEditSave = () => {
    setIsNameDialogOpen(true);
  };

  return (
    <>
      <div className="bg-card/80 text-card-foreground flex items-center">
        <div className="flex min-h-14 flex-1 items-center gap-2 px-4">
          <div className="flex animate-pulse items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-card-foreground/60 text-sm font-medium">Editing</span>
          </div>
          <span className="max-w-56 truncate px-2 text-sm font-semibold">{theme.name}</span>
        </div>

        <Separator orientation="vertical" className="bg-border h-8" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-14 shrink-0 rounded-none"
                onClick={handleThemeEditCancel}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cancel changes</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-border h-8" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-14 shrink-0 rounded-none"
                onClick={handleThemeEditSave}
                disabled={disabled}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save changes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ThemeSaveDialog
        open={isNameDialogOpen}
        onOpenChange={setIsNameDialogOpen}
        onSave={handleSaveTheme}
        isSaving={isSaving}
        initialThemeName={theme.name}
        title="Save Theme Changes"
        description="Confirm or update the theme name before saving."
        ctaLabel="Save Changes"
      />
    </>
  );
};

export default ThemeEditActions;
