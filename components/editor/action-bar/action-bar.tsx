"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { parseCssInput } from "@/utils/parse-css-input";
import { toast } from "@/hooks/use-toast";
import { CodePanelDialog } from "@/components/editor/code-panel-dialog";
import CssImportDialog from "@/components/editor/css-import-dialog";
import { ThemeSaveDialog } from "@/components/editor/theme-save-dialog";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { useThemeActions } from "@/hooks/use-theme-actions";
import { ActionBarButtons } from "@/components/editor/action-bar/components/action-bar-buttons";
import { usePostHog } from "posthog-js/react";
import { AIGenerateDialog } from "@/components/editor/action-bar/components/ai-generate-dialog";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { ShareDialog } from "@/components/editor/share-dialog";
import { useThemePresetStore } from "@/store/theme-preset-store";

export function ActionBar() {
  const { themeState, setThemeState, applyThemePreset, hasThemeChangedFromCheckpoint } =
    useEditorStore();
  const [cssImportOpen, setCssImportOpen] = useState(false);
  const [codePanelOpen, setCodePanelOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shareAfterSave, setShareAfterSave] = useState(false);
  const [aiGenerateOpen, setAiGenerateOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();
  const { createTheme, isCreatingTheme } = useThemeActions();
  const posthog = usePostHog();
  const { generateTheme, loading: aiGenerateLoading } = useAIThemeGeneration({
    onSuccess: () => {
      setAiGenerateOpen(false);
      setDialogKey((prev) => prev + 1);
    },
  });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const { getPreset } = useThemePresetStore();

  usePostLoginAction("SAVE_THEME", () => {
    setSaveDialogOpen(true);
  });

  usePostLoginAction("AI_GENERATE_FROM_DIALOG", () => {
    setAiGenerateOpen(true);
  });

  usePostLoginAction("SAVE_THEME_FOR_SHARE", () => {
    setSaveDialogOpen(true);
    setShareAfterSave(true);
  });

  const handleGenerateTheme = async (promptText: string, jsonPromptText: string) => {
    if (!promptText.trim()) return;
    await generateTheme(promptText, jsonPromptText);

    posthog.capture("AI_GENERATE_THEME", {
      prompt_text: promptText,
    });
  };

  const handleAiGenerateClick = () => {
    if (!session) {
      openAuthDialog("signin", "AI_GENERATE_FROM_DIALOG");
      return;
    }

    setAiGenerateOpen(true);
  };

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

  const handleSaveClick = (options?: { shareAfterSave?: boolean }) => {
    if (!session) {
      openAuthDialog("signin", options?.shareAfterSave ? "SAVE_THEME_FOR_SHARE" : "SAVE_THEME");
      return;
    }

    setSaveDialogOpen(true);
    if (options?.shareAfterSave) {
      setShareAfterSave(true);
    }
  };

  const saveTheme = async (themeName: string) => {
    const themeData = {
      name: themeName,
      styles: themeState.styles,
    };

    try {
      const theme = await createTheme(themeData);
      posthog.capture("CREATE_THEME", {
        theme_id: theme?.id,
        theme_name: theme?.name,
      });
      if (!theme) return;
      applyThemePreset(theme?.id || themeState.preset || "default");
      if (shareAfterSave) {
        handleShareClick(theme?.id);
        setShareAfterSave(false);
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

      <CssImportDialog
        open={cssImportOpen}
        onOpenChange={setCssImportOpen}
        onImport={handleCssImport}
      />
      <CodePanelDialog
        open={codePanelOpen}
        onOpenChange={setCodePanelOpen}
        themeEditorState={themeState}
      />
      <ThemeSaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={saveTheme}
        isSaving={isCreatingTheme}
      />
      <AIGenerateDialog
        key={dialogKey}
        open={aiGenerateOpen}
        onOpenChange={setAiGenerateOpen}
        loading={aiGenerateLoading}
        onGenerate={handleGenerateTheme}
      />
      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} url={shareUrl} />
    </div>
  );
}
