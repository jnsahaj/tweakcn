import { Separator } from "@/components/ui/separator";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { useAIChatStore } from "@/store/ai-chat-store";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { CodeButton } from "./code-button";
import { EditButton } from "./edit-button";
import { ImportButton } from "./import-button";
import { MoreOptions } from "./more-options";
import { ResetButton } from "./reset-button";
import { SaveButton } from "./save-button";
import { ShareButton } from "./share-button";
import { ThemeToggle } from "./theme-toggle";
import { UndoRedoButtons } from "./undo-redo-buttons";

interface ActionBarButtonsProps {
  onImportClick: () => void;
  onCodeClick: () => void;
  onSaveClick: () => void;
  onShareClick: (id?: string) => void;
  isSaving: boolean;
}

export function ActionBarButtons({
  onImportClick,
  onCodeClick,
  onSaveClick,
  onShareClick,
  isSaving,
}: ActionBarButtonsProps) {
  const { themeState, resetToCurrentPreset, hasUnsavedChanges } = useEditorStore();
  const { loading: aiGenerationLoading } = useAIThemeGenerationCore();
  const { getPreset } = useThemePresetStore();
  const currentPreset = themeState?.preset ? getPreset(themeState?.preset) : undefined;
  const isSavedPreset = !!currentPreset && currentPreset.source === "SAVED";
  const { clearMessages } = useAIChatStore();

  const handleReset = () => {
    resetToCurrentPreset();
    clearMessages();
  };

  return (
    <div className="flex items-center gap-1">
      <MoreOptions disabled={aiGenerationLoading} />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <ThemeToggle />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <UndoRedoButtons disabled={aiGenerationLoading} />
      <Separator orientation="vertical" className="mx-1 h-8" />
      <ResetButton onClick={handleReset} disabled={!hasUnsavedChanges() || aiGenerationLoading} />
      <div className="hidden items-center gap-1 md:flex">
        <ImportButton onClick={onImportClick} disabled={aiGenerationLoading} />
      </div>
      <Separator orientation="vertical" className="mx-1 h-8" />
      {isSavedPreset && (
        <EditButton themeId={themeState.preset as string} disabled={aiGenerationLoading} />
      )}
      <ShareButton onClick={() => onShareClick(themeState.preset)} disabled={aiGenerationLoading} />
      <SaveButton onClick={onSaveClick} isSaving={isSaving} disabled={aiGenerationLoading} />
      <CodeButton onClick={onCodeClick} disabled={aiGenerationLoading} />
    </div>
  );
}
