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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Community Themes</h1>
          <p className="text-muted-foreground mt-2">
            Discover beautiful themes created by the community.
          </p>
        </div>
        <CommunityThemesContent />
      </div>
    </div>
  );
}
