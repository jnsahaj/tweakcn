"use client";

import { ActionBarButtons } from "@/components/editor/action-bar/components/action-bar-buttons";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { DialogActionsProvider, useDialogActions } from "@/hooks/use-dialog-actions";
import { useActionsStore } from "@/store/action-store";
import { useEffect} from "react";

export function ActionBar() {
  return (
    <DialogActionsProvider>
      <ActionBarContent />
    </DialogActionsProvider>
  );
}

function ActionBarContent() {
  const { isCreatingTheme, handleSaveClick, handleShareClick, setCssImportOpen, setCodePanelOpen } =
    useDialogActions();

    const setHandleSaveClick = useActionsStore((store) => store.setHandleSaveClick)
    const setSetCodePanelOpen = useActionsStore((store) => store.setSetCodePanelOpen)

    useEffect(()=> {
      setHandleSaveClick(handleSaveClick)
      return () => setHandleSaveClick(() => {})
    },[setHandleSaveClick , handleSaveClick])

    useEffect(() => {
      setSetCodePanelOpen(setCodePanelOpen)
      return () => setSetCodePanelOpen(() => {})
    },[setCodePanelOpen, setSetCodePanelOpen])

  return (
    <div className="border-b">
      <HorizontalScrollArea className="flex h-14 w-full items-center justify-end gap-4 px-4">
        <ActionBarButtons
          onImportClick={() => setCssImportOpen(true)}
          onCodeClick={() => setCodePanelOpen(true)}
          onSaveClick={() => handleSaveClick()}
          isSaving={isCreatingTheme}
          onShareClick={handleShareClick}
        />
      </HorizontalScrollArea>
    </div>
  );
}