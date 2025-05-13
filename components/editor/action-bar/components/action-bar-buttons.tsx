import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { ImportButton } from "./import-button";
import { ResetButton } from "./reset-button";
import { SaveButton } from "./save-button";
import { CodeButton } from "./code-button";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { EditButton } from "./edit-button";
import { MoreOptions } from "./more-options";
import { AIGenerateButton } from "./ai-generate-button";
import { ShareButton } from "./share-button";

interface ActionBarButtonsProps {
  onImportClick: () => void;
  onCodeClick: () => void;
  onSaveClick: () => void;
  onAiGenerateClick: () => void;
  onShareClick: (id?: string) => void;
  isSaving: boolean;
}

export function ActionBarButtons({
  onImportClick,
  onCodeClick,
  onSaveClick,
  onAiGenerateClick,
  onShareClick,
  isSaving,
}: ActionBarButtonsProps) {
  const { themeState, resetToCurrentPreset, hasThemeChangedFromCheckpoint } = useEditorStore();

  const { getPreset } = useThemePresetStore();
  const currentPreset = themeState?.preset ? getPreset(themeState?.preset) : undefined;
  const isSavedPreset = !!currentPreset && currentPreset.source === "SAVED";

  return (
    <div className="flex items-center gap-1">
      <MoreOptions />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <ThemeToggle />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <ResetButton onReset={resetToCurrentPreset} isDisabled={!hasThemeChangedFromCheckpoint()} />
      <ImportButton onImportClick={onImportClick} />
      <AIGenerateButton onClick={onAiGenerateClick} />
      <Separator orientation="vertical" className="mx-1 h-8" />
      {isSavedPreset && <EditButton themeId={themeState.preset as string} />}
      <ShareButton onShareClick={() => onShareClick(themeState.preset)} />
      <SaveButton onSaveClick={onSaveClick} isSaving={isSaving} />
      <CodeButton onCodeClick={onCodeClick} />
    </div>
  );
}
