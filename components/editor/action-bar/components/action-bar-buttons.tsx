import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { ImportButton } from "./import-button";
import { ResetButton } from "./reset-button";
import { SaveButton } from "./save-button";
import { CodeButton } from "./code-button";
import ContrastChecker from "@/components/editor/contrast-checker";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { EditButton } from "./edit-button";
import { MoreOptions } from "./more-options";

interface ActionBarButtonsProps {
  onImportClick: () => void;
  onCodeClick: () => void;
  onSaveClick: () => void;
  isSaving: boolean;
}

export function ActionBarButtons({
  onImportClick,
  onCodeClick,
  onSaveClick,
  isSaving,
}: ActionBarButtonsProps) {
  const { themeState, restoreThemeCheckpoint, hasThemeChangedFromCheckpoint } =
    useEditorStore();

  const { getPreset } = useThemePresetStore();
  const currentPreset = themeState?.preset && getPreset(themeState?.preset);
  const showEditButton = !!currentPreset && currentPreset.source === "SAVED";

  return (
    <div className="flex items-center gap-1">
      <MoreOptions />
      <Separator orientation="vertical" className="h-8 mx-1" />
      <ThemeToggle />
      <Separator orientation="vertical" className="h-8 mx-1" />
      <ContrastChecker
        currentStyles={themeState.styles[themeState.currentMode]}
      />
      <ImportButton onImportClick={onImportClick} />
      <ResetButton
        onReset={restoreThemeCheckpoint}
        isDisabled={!hasThemeChangedFromCheckpoint()}
      />
      <Separator orientation="vertical" className="h-8 mx-1" />
      {showEditButton && <EditButton themeId={themeState.preset as string} />}
      <SaveButton onSaveClick={onSaveClick} isSaving={isSaving} />
      <CodeButton onCodeClick={onCodeClick} />
    </div>
  );
}
