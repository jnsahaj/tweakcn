import { getThemes } from "@/actions/themes";
import { ThemesList } from "@/app/settings/components/themes-list";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Palette, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SettingsHeader } from "../components/settings-header";

export default async function ThemesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/editor/theme");

  const themes = await getThemes();
  const sortedThemes = themes.sort((a, b) => {
    return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
  });

  return (
    <div>
      <SettingsHeader title="Your Themes" description="View and manage your themes" />
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
        <ThemesList themes={sortedThemes} />
      )}
    </div>
  );
}
