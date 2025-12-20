import { CodePanelDialog } from "@/components/editor/code-panel-dialog";
import CssImportDialog from "@/components/editor/css-import-dialog";
import { ShareDialog } from "@/components/editor/share-dialog";
import { ThemeSaveDialog } from "@/components/editor/theme-save-dialog";
import { toast } from "@/components/ui/use-toast";
import { useCreateTheme } from "@/hooks/themes";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { parseCssInput } from "@/utils/parse-css-input";
import { usePostHog } from "posthog-js/react";
import { createContext, ReactNode, useContext, useState } from "react";

type PendingAction = "share" | "v0" | null;

// Get contextual copy for the save dialog based on the pending action
function getSaveDialogCopy(pendingAction: PendingAction) {
  switch (pendingAction) {
    case "share":
      return {
        title: "Save to share",
        description: "Save your theme first to share it with others.",
        ctaLabel: "Save & Share",
      };
    case "v0":
      return {
        title: "Save to open in v0",
        description: "Save your theme first to open it in v0.",
        ctaLabel: "Save & Open in v0",
      };
    default:
      return {};
  }
}

interface DialogActionsContextType {
  // Dialog states
  cssImportOpen: boolean;
  codePanelOpen: boolean;
  saveDialogOpen: boolean;
  shareDialogOpen: boolean;
  shareUrl: string;
  dialogKey: number;
  isCreatingTheme: boolean;
  isGeneratingTheme: boolean;
  pendingAction: PendingAction;

  // Dialog actions
  setCssImportOpen: (open: boolean) => void;
  setCodePanelOpen: (open: boolean) => void;
  setSaveDialogOpen: (open: boolean) => void;
  setShareDialogOpen: (open: boolean) => void;

  // Handler functions
  handleCssImport: (css: string) => void;
  handleSaveClick: (options?: { shareAfterSave?: boolean; openInV0AfterSave?: boolean }) => void;
  handleShareClick: (id?: string) => Promise<void>;
  handleOpenInV0: (id?: string) => void;
  saveTheme: (themeName: string) => Promise<void>;
}

function useDialogActionsStore(): DialogActionsContextType {
  const [cssImportOpen, setCssImportOpen] = useState(false);
  const [codePanelOpen, setCodePanelOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [dialogKey, _setDialogKey] = useState(0);

  const { themeState, setThemeState, applyThemePreset, hasThemeChangedFromCheckpoint } =
    useEditorStore();
  const { getPreset } = useThemePresetStore();
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();
  const createThemeMutation = useCreateTheme();
  const { isGeneratingTheme } = useAIThemeGenerationCore();
  const posthog = usePostHog();

  usePostLoginAction("SAVE_THEME", () => {
    setSaveDialogOpen(true);
  });

  usePostLoginAction("SAVE_THEME_FOR_SHARE", () => {
    setSaveDialogOpen(true);
    setPendingAction("share");
  });

  usePostLoginAction("SAVE_THEME_FOR_V0", () => {
    setSaveDialogOpen(true);
    setPendingAction("v0");
  });

  const handleCssImport = (css: string) => {
    const { lightColors, darkColors } = parseCssInput(css);
    const styles = {
      ...themeState.styles,
      light: { ...themeState.styles.light, ...lightColors },
      dark: { ...themeState.styles.dark, ...darkColors },
    };

    setThemeState({
      ...themeState,
      styles,
    });

    toast({
      title: "CSS imported",
      description: "Your custom CSS has been imported successfully",
    });
  };

  const handleSaveClick = (options?: { shareAfterSave?: boolean; openInV0AfterSave?: boolean }) => {
    if (!session) {
      let action: "SAVE_THEME" | "SAVE_THEME_FOR_SHARE" | "SAVE_THEME_FOR_V0" = "SAVE_THEME";
      if (options?.shareAfterSave) action = "SAVE_THEME_FOR_SHARE";
      if (options?.openInV0AfterSave) action = "SAVE_THEME_FOR_V0";
      openAuthDialog("signin", action);
      return;
    }

    setSaveDialogOpen(true);
    if (options?.shareAfterSave) {
      setPendingAction("share");
    }
    if (options?.openInV0AfterSave) {
      setPendingAction("v0");
    }
  };

  const saveTheme = async (themeName: string) => {
    const themeData = {
      name: themeName,
      styles: themeState.styles,
    };

    try {
      const theme = await createThemeMutation.mutateAsync(themeData);
      posthog.capture("CREATE_THEME", {
        theme_id: theme?.id,
        theme_name: theme?.name,
      });
      if (!theme) return;
      applyThemePreset(theme?.id || themeState.preset || "default");
      if (pendingAction === "share") {
        handleShareClick(theme?.id);
        setPendingAction(null);
      } else if (pendingAction === "v0") {
        openInV0(theme?.id);
        setPendingAction(null);
      }
      setTimeout(() => {
        setSaveDialogOpen(false);
      }, 50);
    } catch (error) {
      console.error("Save operation failed (error likely handled by hook):", error);
    }
  };

  const handleShareClick = async (id?: string) => {
    if (hasThemeChangedFromCheckpoint()) {
      handleSaveClick({ shareAfterSave: true });
      return;
    }

    const presetId = id ?? themeState.preset;
    const currentPreset = presetId ? getPreset(presetId) : undefined;

    if (!currentPreset) {
      setShareUrl(`https://tweakcn.com/editor/theme`);
      setShareDialogOpen(true);
      return;
    }

    const isSavedPreset = !!currentPreset && currentPreset.source === "SAVED";

    posthog.capture("SHARE_THEME", {
      theme_id: id,
      theme_name: currentPreset?.label,
      is_saved: isSavedPreset,
    });

    const url = isSavedPreset
      ? `https://tweakcn.com/themes/${id}`
      : `https://tweakcn.com/editor/theme?theme=${id}`;

    setShareUrl(url);
    setShareDialogOpen(true);
  };

  // Internal helper to open v0 with a theme
  const openInV0 = (id?: string) => {
    const presetId = id ?? themeState.preset;
    if (!presetId) return;

    const currentPreset = getPreset(presetId);
    const isSavedPreset = !!currentPreset && currentPreset.source === "SAVED";
    const themeName = currentPreset?.label || presetId;

    posthog.capture("OPEN_IN_V0", {
      theme_id: presetId,
      theme_name: themeName,
      is_saved: isSavedPreset,
    });

    const themeUrl = isSavedPreset
      ? `https://tweakcn.com/r/v0/${presetId}`
      : `https://tweakcn.com/r/v0/${presetId}.json`;
    const title = `"${themeName}" from tweakcn`;
    const v0Url = `https://v0.dev/chat/api/open?url=${encodeURIComponent(themeUrl)}&title=${encodeURIComponent(title)}`;
    window.open(v0Url, "_blank", "noopener,noreferrer");
  };

  const handleOpenInV0 = (id?: string) => {
    if (hasThemeChangedFromCheckpoint()) {
      handleSaveClick({ openInV0AfterSave: true });
      return;
    }

    openInV0(id);
  };

  const value = {
    // Dialog states
    cssImportOpen,
    codePanelOpen,
    saveDialogOpen,
    shareDialogOpen,
    shareUrl,
    dialogKey,
    isCreatingTheme: createThemeMutation.isPending,
    isGeneratingTheme,
    pendingAction,

    // Dialog actions
    setCssImportOpen,
    setCodePanelOpen,
    setSaveDialogOpen,
    setShareDialogOpen,

    // Handler functions
    handleCssImport,
    handleSaveClick,
    handleShareClick,
    handleOpenInV0,
    saveTheme,
  };

  return value;
}

export const DialogActionsContext = createContext<DialogActionsContextType | null>(null);

export function DialogActionsProvider({ children }: { children: ReactNode }) {
  const { themeState } = useEditorStore();
  const store = useDialogActionsStore();

  return (
    <DialogActionsContext value={store}>
      {children}

      {/* Global Dialogs */}
      <CssImportDialog
        open={store.cssImportOpen}
        onOpenChange={store.setCssImportOpen}
        onImport={store.handleCssImport}
      />
      <CodePanelDialog
        open={store.codePanelOpen}
        onOpenChange={store.setCodePanelOpen}
        themeEditorState={themeState}
      />
      <ThemeSaveDialog
        open={store.saveDialogOpen}
        onOpenChange={store.setSaveDialogOpen}
        onSave={store.saveTheme}
        isSaving={store.isCreatingTheme}
        {...getSaveDialogCopy(store.pendingAction)}
      />
      <ShareDialog
        open={store.shareDialogOpen}
        onOpenChange={store.setShareDialogOpen}
        url={store.shareUrl}
      />
    </DialogActionsContext>
  );
}

export function useDialogActions(): DialogActionsContextType {
  const context = useContext(DialogActionsContext);

  if (!context) {
    throw new Error("useDialogActions must be used within a DialogActionsProvider");
  }

  return context;
}
