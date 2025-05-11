"use client";

import { createContext, useContext, useState } from "react";

interface PreviewPanelContextType {
  isPreviewPanelOpen: boolean;
  togglePreviewPanel: () => void;
  setIsPreviewPanelOpen: (value: boolean) => void;
}

const PreviewPanelContext = createContext<PreviewPanelContextType | undefined>(undefined);

export function PreviewPanelProvider({ children }: { children: React.ReactNode }) {
  const [isPreviewPanelOpen, setIsPreviewPanelOpen] = useState(false);

  const togglePreviewPanel = () => {
    console.log("Toggling preview panel");
    setIsPreviewPanelOpen((prev) => !prev);
  };

  return (
    <PreviewPanelContext.Provider
      value={{
        isPreviewPanelOpen,
        togglePreviewPanel,
        setIsPreviewPanelOpen,
      }}
    >
      {children}
    </PreviewPanelContext.Provider>
  );
}

export function usePreviewPanel() {
  const context = useContext(PreviewPanelContext);

  if (context === undefined) {
    throw new Error("usePreviewPanel must be used within a PreviewPanelProvider");
  }

  return context;
}
