import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { CommunityThemeCard, CommunityThemeCardSkeleton } from "./community-theme-card";
import { ThemePreset } from "@/types/theme";
import { defaultPresets } from "@/utils/theme-presets";

// TODO: Remove this once we have a real API to fetch the community themes
const getDefaultThemePresets = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return defaultPresets;
};

export async function CommunityThemes() {
  const themePresetsPromise = getDefaultThemePresets();

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">From the Community</h2>
          <Button variant="link" className="h-fit gap-1 p-0 [&>svg]:size-3">
            View All <ChevronRight />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Explore the themes the community is creating with tweakcn.
        </p>
      </div>

      <div className="grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <>
              <CommunityThemeCardSkeleton />
              <CommunityThemeCardSkeleton />
              <CommunityThemeCardSkeleton />
            </>
          }
        >
          <CommunityThemeCards themePresetsPromise={themePresetsPromise} />
        </Suspense>
      </div>
    </>
  );
}

interface CommunityThemeCardsProps {
  themePresetsPromise: Promise<Record<string, ThemePreset>>;
}

export async function CommunityThemeCards({ themePresetsPromise }: CommunityThemeCardsProps) {
  const themePresets = await themePresetsPromise;
  const presets = Object.entries(themePresets).reduce(
    (acc, [id, preset]) => {
      acc[id] = {
        label: preset.label,
        styles: preset.styles,
      };
      return acc;
    },
    {} as Record<string, ThemePreset>
  );

  return (
    <>
      {Object.values(presets).map((preset) => (
        <CommunityThemeCard key={preset.label} themePreset={preset} />
      ))}
    </>
  );
}
