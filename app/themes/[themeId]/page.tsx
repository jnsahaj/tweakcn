import { Suspense } from "react";
import { getThemeWithCommunity } from "@/actions/themes";
import ThemeView from "@/components/theme-view";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Loading } from "@/components/loading";
import { ThemeLikeHandler } from "@/app/(community)/themes/components/theme-like-handler";

interface ThemePageProps {
  params: Promise<{
    themeId: string;
  }>;
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { themeId } = await params;
  const result = await getThemeWithCommunity(themeId);
  const theme = result?.theme;

  if (!theme) {
    return {
      title: "Theme Not Found - tweakcn",
      description: "The requested theme could not be found",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title: theme.name + " - tweakcn",
    description: `Discover shadcn/ui themes - ${theme.name} theme`,
    openGraph: {
      title: `${theme.name} - tweakcn`,
      description: `Discover shadcn/ui themes - ${theme.name} theme`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${theme.name} - tweakcn`,
      description: `Discover shadcn/ui themes - ${theme.name} theme`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { themeId } = await params;

  const result = await getThemeWithCommunity(themeId);
  const theme = result?.theme;

  if (!theme) {
    notFound();
  }

  const communityTheme = result?.communityTheme;

  return (
    <>
      <ThemeLikeHandler />
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
    </>
  );
}
