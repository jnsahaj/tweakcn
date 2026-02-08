import { Metadata } from "next";
import { CommunityThemesContent } from "./components/community-themes-content";
import { CommunityPageHeader } from "./components/community-page-header";

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
      <div className="container mx-auto px-4 py-10 md:py-14">
        <CommunityPageHeader />
        <CommunityThemesContent />
      </div>
    </div>
  );
}
