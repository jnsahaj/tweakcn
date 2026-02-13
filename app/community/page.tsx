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
      <div className="relative isolate overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="relative mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Community
            </p>
            <h1 className="mt-2 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              Themes
            </h1>
            <p className="text-muted-foreground mt-3 text-base text-pretty leading-relaxed">
              Discover beautiful shadcn/ui themes created by the community.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <CommunityThemesContent />
      </div>
    </div>
  );
}
