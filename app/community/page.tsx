import { Metadata } from "next";
import { CommunityThemesContent } from "./components/community-themes-content";
import { COMMUNITY_THEME_TAGS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Community Themes - tweakcn",
  description:
    "Discover and explore beautiful shadcn/ui themes created by the community.",
  keywords: [...COMMUNITY_THEME_TAGS, "shadcn", "theme", "ui"],
  openGraph: {
    title: "Community Themes - tweakcn",
    description:
      "Discover and explore beautiful shadcn/ui themes created by the community.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Themes - tweakcn",
    description:
      "Discover and explore beautiful shadcn/ui themes created by the community.",
  },
};

export default function CommunityPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero section */}
      <div className="from-background via-background to-muted/30 relative overflow-hidden border-b bg-gradient-to-b">
        <div className="bg-primary/5 absolute top-0 right-0 size-96 translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute bottom-0 left-0 size-64 -translate-x-1/3 translate-y-1/3 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 pt-16 pb-12">
          <div className="max-w-2xl">
            <h1 className="from-foreground to-foreground/70 flex items-center bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              Community Themes
              <span className="bg-primary text-primary-foreground ml-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
                New
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 text-lg text-pretty">
              Discover and explore beautiful shadcn/ui themes created by the
              community. Like your favorites and open them in the editor.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <CommunityThemesContent />
      </div>
    </div>
  );
}
