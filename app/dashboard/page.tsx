import { getThemes } from "@/actions/themes";
import { ThemesList } from "@/app/dashboard/components/themes-list";
import { Button } from "@/components/ui/button";
import { Palette, Plus } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const themes = await getThemes();
  const sortedThemes = themes.sort((a, b) => {
    return b.createdAt?.getTime() - a.createdAt?.getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Themes</h1>
          <p className="text-muted-foreground mt-1">Manage and explore your custom color themes</p>
        </div>
        <Link href="/editor/theme">
          <Button className="gap-1" variant="accent">
            New Theme
            <Plus className="size-4" />
          </Button>
        </Link>
      </div>

      {sortedThemes.length === 0 ? (
        <div className="bg-card flex flex-col items-center justify-center rounded-xl border p-8 py-16 text-center shadow-sm">
          <div className="bg-primary/10 mb-6 rounded-full p-4">
            <Palette className="text-primary size-12" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold">No themes created yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first custom theme to personalize your projects with unique color palettes
          </p>
          <div className="w-full max-w-md space-y-6">
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
  );
}
