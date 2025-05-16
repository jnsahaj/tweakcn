import { getCommunityThemes } from "@/actions/community-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ThemeCard } from "@/app/(community)/themes/components/theme-card";

export default async function CommunityThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sortBy = (await searchParams).sort === "likes" ? "likes_count" : "created_at";

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
          <span className="text-sm font-medium">Sort by:</span>
          {/* <ToggleGroup type="single" defaultValue={sortBy === "likes_count" ? "likes" : "newest"}>
            <Link href="/community/themes" legacyBehavior passHref>
              <ToggleGroupItem value="newest" aria-label="Sort by newest">
                Newest
              </ToggleGroupItem>
            </Link>
            <Link href="/community/themes?sort=likes" legacyBehavior passHref>
              <ToggleGroupItem value="likes" aria-label="Sort by most liked">
                Most Liked
              </ToggleGroupItem>
            </Link>
          </ToggleGroup> */}
        </div>
      </div>

      {themes.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No themes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <ThemeCard theme={theme} key={theme.id} />
          ))}
        </div>
      )}
    </div>
  );
}
