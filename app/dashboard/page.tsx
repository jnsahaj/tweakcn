import { getThemes } from "@/actions/themes";
import { Header } from "@/components/header";
import { Palette, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemesList } from "@/app/dashboard/components/themes-list";

export default async function ProfilePage() {
  const themes = await getThemes();
  const sortedThemes = themes.sort((a, b) => {
    return b.createdAt?.getTime() - a.createdAt?.getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Themes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and explore your custom color themes
            </p>
          </div>
          <Link href="/editor/theme">
            <Button className="gap-1" variant="accent">
              New Theme
              <Plus className="size-4" />
            </Button>
          </Link>
        </div>

        {sortedThemes.length === 0 ? (
          <div className="bg-card rounded-xl border shadow-sm p-8 flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-6">
              <Palette className="size-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              No themes created yet
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Create your first custom theme to personalize your projects with
              unique color palettes
            </p>
            <div className="space-y-6 w-full max-w-md">
              <Link href="/editor/theme">
                <Button size="lg" className="w-full gap-2">
                  <Plus className="size-4" />
                  Create Your First Theme
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ThemesList themes={sortedThemes} totalCount={themes.length} />
        )}
      </div>
    </div>
  );
}
