"use client";

import { ActionBarButtons } from "@/components/editor/action-bar/components/action-bar-buttons";
import { DialogActionsProvider, useDialogActions } from "@/hooks/use-dialog-actions";

export function ActionBar() {
  return (
    <DialogActionsProvider>
      <ActionBarContent />
    </DialogActionsProvider>
  );
}

function ActionBarContent() {
  const {
    isCreatingTheme,
    handleSaveClick,
    handleAiGenerateClick,
    handleShareClick,
    setCssImportOpen,
    setCodePanelOpen,
  } = useDialogActions();

  return (
    <div className="border-b">
      <div className="flex h-14 items-center justify-end gap-4 px-4">
        <ActionBarButtons
          onImportClick={() => setCssImportOpen(true)}
          onCodeClick={() => setCodePanelOpen(true)}
          onSaveClick={() => handleSaveClick()}
          onAiGenerateClick={handleAiGenerateClick}
          isSaving={isCreatingTheme}
          onShareClick={handleShareClick}
        />
      </div>
    </div>
  );
}
