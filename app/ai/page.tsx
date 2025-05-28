import { AuthDialogWrapper } from "@/components/auth-dialog-wrapper";
import { Metadata } from "next";
import { AIAnnouncement } from "./components/ai-announcement";
import { AIChatHero } from "./components/ai-chat-hero";
import { CommunityThemes } from "./components/community-themes";

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
    <>
      <AuthDialogWrapper />
      <div className="relative isolate container mx-auto flex flex-1 flex-col gap-24 overflow-x-visible overflow-y-auto px-4 md:px-6">
        {/* AI Chat entry point section */}
        <section className="relative isolate flex flex-col gap-4 pt-28 lg:pt-44">
          <AIAnnouncement />
          <AIChatHero />
        </section>

        {/* Community section */}
        <section className="bg-muted/50 border-border/75! relative isolate mb-24 flex w-full flex-col gap-4 rounded-xl border p-8 lg:mb-32">
          <CommunityThemes />
        </section>
      </div>
    </>
  );
}
