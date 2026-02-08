import { Metadata } from "next";
import { CommunityThemesContent } from "./components/community-themes-content";

export const metadata: Metadata = {
  title: "Community Themes - tweakcn",
  description:
    "Discover and explore beautiful shadcn/ui themes created by the community.",
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
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">
            Community Themes
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Discover and explore beautiful shadcn/ui themes created by the
            community. Like your favorites and open them in the editor.
          </p>
        </div>
        <CommunityThemesContent />
      </div>
    </div>
  );
}
