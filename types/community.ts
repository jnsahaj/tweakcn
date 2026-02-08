import { ThemeStyles } from "@/types/theme";

export interface CommunityThemeAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface CommunityTheme {
  id: string;
  themeId: string;
  name: string;
  styles: ThemeStyles;
  author: CommunityThemeAuthor;
  likeCount: number;
  isLikedByMe: boolean;
  publishedAt: string;
  tags: string[];
}

export type CommunitySortOption = "popular" | "newest" | "oldest";

export interface CommunityThemesResponse {
  themes: CommunityTheme[];
  nextCursor: string | number | null;
}
