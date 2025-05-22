import { Suspense } from "react";
import { getTheme } from "@/actions/themes";
import { getCommunityThemeByThemeId } from "@/actions/community-themes";
import ThemeView from "@/components/theme-view";
import { Metadata } from "next";
import { Header } from "@/components/header";
import { Loading } from "@/components/loading";

interface ThemePageProps {
  params: Promise<{
    themeId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ThemePageProps): Promise<Metadata> {
  const { themeId } = await params;
  const theme = await getTheme(themeId);

  return {
    title: theme?.name + " - tweakcn",
    description: `Discover shadcn/ui themes - ${theme?.name} theme`,
    openGraph: {
      title: `${theme?.name} - tweakcn`,
      description: `Discover shadcn/ui themes - ${theme?.name} theme`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${theme?.name} - tweakcn`,
      description: `Discover shadcn/ui themes - ${theme?.name} theme`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { themeId } = await params;
  const theme = await getTheme(themeId);
  
  const communityTheme = theme ? await getCommunityThemeByThemeId(theme.id) : null;

  return (
    <Suspense
      fallback={
        <>
          <Header />
          <Loading />
        </>
      }
    >
      <ThemeView theme={theme} communityTheme={communityTheme} />
    </Suspense>
  );
}
