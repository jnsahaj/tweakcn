import { Metadata } from "next";
import { AIInterface } from "./components/ai-interface";
import { Toolbar } from "./components/toolbar";
import { PreviewPanelProvider } from "./hooks/use-preview-panel";

export const metadata: Metadata = {
  title: "AI Theme Editor for shadcn/ui — tweakcn",
  description:
    "Effortlessly customize and generate shadcn/ui themes using tweakcn's AI-powered editor. Describe your desired theme, and let AI bring it to life. Supports Tailwind CSS, custom styles, and real-time previews.",
  keywords:
    "ai theme editor, shadcn/ui, tailwind css, theme generator, ai design, ui customization, tweakcn, AI assisted theming, frontend development, web design AI",
  robots: "index, follow",
};

export default function AiPage() {
  return (
    <PreviewPanelProvider>
      <Toolbar />
      <div className="relative isolate flex flex-1 flex-col overflow-hidden">
        <AIInterface />
      </div>
    </PreviewPanelProvider>
  );
}
