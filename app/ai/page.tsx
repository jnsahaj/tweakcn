import { AuthDialogWrapper } from "@/components/auth-dialog-wrapper";
import { Metadata } from "next";
import { AiInterface } from "./components/ai-interface";
import { Toolbar } from "./components/toolbar";

export const metadata: Metadata = {
  title: "AI Editor — tweakcn",
  description: "Easily customize your shadcn/ui theme with tweakcn's AI editor.",
};

export default function AiPage() {
  return (
    <>
      <AuthDialogWrapper />
      <div className="relative isolate flex flex-1 items-center justify-center overflow-hidden">
        <AiInterface />
      </div>
      <Toolbar />
    </>
  );
}
