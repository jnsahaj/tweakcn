import { type Metadata } from "next";
import { AIAnnouncement } from "./components/ai-announcement";
import { AIChatHero } from "./components/ai-chat-hero";

export const metadata: Metadata = {
  title: "Image to shadcn/ui theme. Generate with AI — tweakcn",
  description:
    "Transform images into stunning shadcn/ui themes instantly with tweakcn's AI theme generator. Upload any image or describe your vision—our AI creates custom Tailwind CSS themes with real-time preview. Perfect for developers who want beautiful, production-ready themes in seconds.",
  keywords:
    "ai theme generator, image to theme, shadcn/ui themes, tailwind css generator, ai design tool, theme from image, ui customization, tweakcn, visual theme creator, color palette generator, design system ai, frontend theming, web design automation",
  robots: "index, follow",
};

export default function AiPage() {
  return (
    <div className="relative isolate container mx-auto flex flex-1 flex-col gap-24 overflow-x-hidden overflow-y-auto px-4 md:px-6">
      {/* AI Chat entry point section */}
      <section className="relative isolate flex flex-col gap-4 pt-28 lg:pt-44">
        <AIAnnouncement />
        <AIChatHero />
      </section>
    </div>
  );
}
