import { AuthDialogWrapper } from "@/components/auth-dialog-wrapper";
import { Metadata } from "next";
import { AIInterface } from "./components/ai-interface";
import { Toolbar } from "./components/toolbar";
import { PreviewPanelProvider } from "./hooks/use-preview-panel";

export const metadata: Metadata = {
  title: "AI Editor — tweakcn",
  description: "Easily customize your shadcn/ui theme with tweakcn's AI editor.",
};

export default function AiPage() {
  return (
    <PreviewPanelProvider>
      <Toolbar />
      <AuthDialogWrapper />
      <div className="relative isolate flex flex-1 items-center justify-center overflow-hidden">
        <AIInterface />
      </div>
    </PreviewPanelProvider>
  );
}
