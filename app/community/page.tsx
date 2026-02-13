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
  return <CommunityThemesContent />;
}
