"use client";

import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { likeCommunityTheme } from "@/actions/community-themes";

export function useThemeLikeHandler() {
  usePostLoginAction("LIKE_THEME", async (data) => {
    if (!data?.themeId) return;
    await likeCommunityTheme(data.themeId);
  });
}
