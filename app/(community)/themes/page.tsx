import { getCommunityThemes } from "@/actions/community-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ThemeCard } from "@/app/(community)/themes/components/theme-card";
import { SortBySelector } from "@/app/(community)/themes/components/sort-by-selector";

export default async function CommunityThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sortBy = (await searchParams).sort === "popular" ? "likes_count" : "created_at";

  const { themes, pagination } = await getCommunityThemes({
    status: "approved", // Only show approved themes
    sortBy,
    sortDirection: "desc",
    limit: 20, // Show more themes at once
  });

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Community Themes</h1>
        <p className="text-muted-foreground">Browse themes created by the community</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SortBySelector />
        </div>
      </div>

      {themes.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No themes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {themes.map((theme) => (
            <ThemeCard theme={theme} key={theme.id} />
          ))}
        </div>
      )}
    </div>
  );
}
