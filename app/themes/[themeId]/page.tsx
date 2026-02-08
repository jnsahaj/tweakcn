import { getTheme } from "@/actions/themes";
import { getCommunityDataForTheme } from "@/actions/community-themes";
import ThemeView from "@/components/theme-view";
import { Metadata } from "next";

interface ThemePageProps {
  params: Promise<{
    themeId: string;
  }>;
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { themeId } = await params;
  const [theme, communityData] = await Promise.all([
    getTheme(themeId),
    getCommunityDataForTheme(themeId),
  ]);

  const tags = communityData?.tags ?? [];
  const authorName = communityData?.author?.name;
  const description =
    tags.length > 0 && authorName
      ? `A ${tags.join(", ")} shadcn/ui theme by ${authorName}`
      : `Discover shadcn/ui themes - ${theme?.name} theme`;

  return {
    title: theme?.name + " - tweakcn",
    description,
    keywords: tags.length > 0 ? tags : undefined,
    openGraph: {
      title: `${theme?.name} - tweakcn`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${theme?.name} - tweakcn`,
      description,
    },
    robots: {
      index: !!communityData,
      follow: true,
    },
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { themeId } = await params;
  const [theme, communityData] = await Promise.all([
    getTheme(themeId),
    getCommunityDataForTheme(themeId),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="container mx-auto px-4 py-8">
        <ThemeView theme={theme} communityData={communityData} />
      </div>
    </div>
  );
}
