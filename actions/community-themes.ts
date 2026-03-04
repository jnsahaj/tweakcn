"use server";

import { z } from "zod";
import { db } from "@/db";
import {
  communityTheme,
  communityThemeTag,
  themeLike,
  theme as themeTable,
  user as userTable,
} from "@/db/schema";
import { eq, and, desc, asc, sql, count, inArray } from "drizzle-orm";
import cuid from "cuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  UnauthorizedError,
  ValidationError,
  ThemeNotFoundError,
  ErrorCode,
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/types/errors";
import {
  COMMUNITY_THEMES_PAGE_SIZE,
  COMMUNITY_THEME_TAGS,
  MAX_TAGS_PER_THEME,
} from "@/lib/constants";
import type {
  CommunityTheme,
  CommunitySortOption,
  CommunityFilterOption,
  CommunityTimeRange,
  CommunityThemesResponse,
} from "@/types/community";
import { unstable_cache, revalidateTag } from "next/cache";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, "3600s"),
});

async function getOptionalUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function getCurrentUserId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  return session.user.id;
}

function logError(error: Error, context: Record<string, unknown>) {
  if (error.name === "UnauthorizedError" || error.name === "ValidationError") {
    console.warn("Expected error:", { error: error.message, context });
  } else {
    console.error("Unexpected error:", {
      error: error.message,
      stack: error.stack,
      context,
    });
  }
}

const getCommunityThemesSchema = z.object({
  sort: z.enum(["popular", "newest", "oldest"]).default("popular"),
  cursor: z.union([z.string(), z.number()]).optional(),
  limit: z.number().min(1).max(50).default(COMMUNITY_THEMES_PAGE_SIZE),
  filter: z.enum(["all", "mine", "liked"]).default("all"),
  tags: z.array(z.string()).default([]),
  timeRange: z.enum(["weekly", "monthly", "all"]).default("all"),
});

// Core query logic for community themes (no headers() access — cacheable)
async function fetchCommunityThemesCore(
  sort: string,
  cursor: string | number | null,
  limit: number,
  filter: string,
  tags: string[],
  userId: string | null,
  timeRange: string = "all"
): Promise<CommunityThemesResponse> {
  const fetchLimit = limit + 1;
  const conditions = [];

  if (filter === "mine") {
    if (!userId) throw new UnauthorizedError();
    conditions.push(eq(communityTheme.userId, userId));
  }

  if (filter === "liked") {
    if (!userId) throw new UnauthorizedError();
    conditions.push(
      sql`exists(select 1 from theme_like where theme_like.theme_id = ${communityTheme.id} and theme_like.user_id = ${userId})`
    );
  }

  if (tags.length > 0) {
    conditions.push(
      sql`exists(select 1 from community_theme_tag where community_theme_tag.community_theme_id = ${communityTheme.id} and community_theme_tag.tag in (${sql.join(
        tags.map((t) => sql`${t}`),
        sql`, `
      )}))`
    );
  }

  // For weekly/monthly popular sort, filter to themes published within the time range
  if (sort === "popular" && timeRange !== "all") {
    const intervalSql =
      timeRange === "weekly"
        ? sql`interval '7 days'`
        : sql`interval '30 days'`;
    conditions.push(
      sql`${communityTheme.publishedAt} > now() - ${intervalSql}`
    );
  }

  const selectFields = {
    id: communityTheme.id,
    themeId: communityTheme.themeId,
    publishedAt: communityTheme.publishedAt,
    themeName: themeTable.name,
    themeStyles: themeTable.styles,
    authorId: userTable.id,
    authorName: userTable.name,
    authorImage: userTable.image,
    likeCount: communityTheme.likeCount,
    ...(userId
      ? {
          isLikedByMe: sql<boolean>`exists(
            select 1 from theme_like
            where theme_like.theme_id = ${communityTheme.id}
            and theme_like.user_id = ${userId}
          )`.as("is_liked_by_me"),
        }
      : {}),
  };

  const baseQuery = db
    .select(selectFields)
    .from(communityTheme)
    .innerJoin(themeTable, eq(communityTheme.themeId, themeTable.id))
    .innerJoin(userTable, eq(communityTheme.userId, userTable.id));

  let results;

  if (sort === "popular") {
    const offset = typeof cursor === "number" ? cursor : 0;
    results = await baseQuery
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(communityTheme.likeCount), desc(communityTheme.publishedAt))
      .limit(fetchLimit)
      .offset(offset);
  } else if (sort === "newest") {
    if (cursor && typeof cursor === "string") {
      conditions.push(sql`${communityTheme.publishedAt} < ${cursor}`);
    }
    results = await baseQuery
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(communityTheme.publishedAt))
      .limit(fetchLimit);
  } else {
    if (cursor && typeof cursor === "string") {
      conditions.push(sql`${communityTheme.publishedAt} > ${cursor}`);
    }
    results = await baseQuery
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(communityTheme.publishedAt))
      .limit(fetchLimit);
  }

  const hasMore = results.length > limit;
  const themes = results.slice(0, limit);

  let nextCursor: string | number | null = null;
  if (hasMore) {
    if (sort === "popular") {
      nextCursor = (typeof cursor === "number" ? cursor : 0) + limit;
    } else {
      const lastTheme = themes[themes.length - 1];
      nextCursor = lastTheme.publishedAt.toISOString();
    }
  }

  const communityThemeIds = themes.map((t) => t.id);
  const tagsRows =
    communityThemeIds.length > 0
      ? await db
          .select({
            communityThemeId: communityThemeTag.communityThemeId,
            tag: communityThemeTag.tag,
          })
          .from(communityThemeTag)
          .where(
            inArray(communityThemeTag.communityThemeId, communityThemeIds)
          )
      : [];

  const tagsMap = new Map<string, string[]>();
  for (const row of tagsRows) {
    const existing = tagsMap.get(row.communityThemeId) ?? [];
    existing.push(row.tag);
    tagsMap.set(row.communityThemeId, existing);
  }

  const mappedThemes: CommunityTheme[] = themes.map((row) => ({
    id: row.id,
    themeId: row.themeId,
    name: row.themeName,
    styles: row.themeStyles,
    author: {
      id: row.authorId,
      name: row.authorName,
      image: row.authorImage,
    },
    likeCount: Number(row.likeCount),
    isLikedByMe: "isLikedByMe" in row ? Boolean(row.isLikedByMe) : false,
    publishedAt: row.publishedAt.toISOString(),
    tags: tagsMap.get(row.id) ?? [],
  }));

  return { themes: mappedThemes, nextCursor };
}

const getCachedCommunityThemes = unstable_cache(
  fetchCommunityThemesCore,
  ["community-themes"],
  { revalidate: 60, tags: ["community-themes"] }
);

export async function getCommunityThemes(
  sort: CommunitySortOption = "popular",
  cursor?: string | number,
  limit: number = COMMUNITY_THEMES_PAGE_SIZE,
  filter: CommunityFilterOption = "all",
  tags: string[] = [],
  timeRange: CommunityTimeRange = "all"
): Promise<CommunityThemesResponse> {
  try {
    const validation = getCommunityThemesSchema.safeParse({
      sort,
      cursor,
      limit,
      filter,
      tags,
      timeRange,
    });
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    const userId = await getOptionalUserId();
    return getCachedCommunityThemes(
      sort,
      cursor ?? null,
      limit,
      filter,
      tags,
      userId,
      timeRange
    );
  } catch (error) {
    logError(error as Error, { action: "getCommunityThemes", sort, cursor });
    throw error;
  }
}

export async function publishTheme(
  themeId: string,
  tags: string[] = []
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();

    if (!themeId) {
      throw new ValidationError("Theme ID required");
    }

    // Validate tags
    if (tags.length > MAX_TAGS_PER_THEME) {
      throw new ValidationError(
        `You can select at most ${MAX_TAGS_PER_THEME} tags`
      );
    }
    const validTags = tags.filter((t): t is string =>
      (COMMUNITY_THEME_TAGS as readonly string[]).includes(t)
    );

    // Verify theme ownership
    const [existingTheme] = await db
      .select()
      .from(themeTable)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.userId, userId)))
      .limit(1);

    if (!existingTheme) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    // Check not already published
    const [existing] = await db
      .select()
      .from(communityTheme)
      .where(eq(communityTheme.themeId, themeId))
      .limit(1);

    if (existing) {
      return actionError(
        ErrorCode.ALREADY_PUBLISHED,
        "This theme is already published to the community."
      );
    }

    // Rate limit
    if (process.env.NODE_ENV !== "development") {
      const { success } = await ratelimit.limit(`publish:${userId}`);
      if (!success) {
        return actionError(
          ErrorCode.UNKNOWN_ERROR,
          "You're publishing too fast. Please try again later."
        );
      }
    }

    const id = cuid();
    await db.insert(communityTheme).values({
      id,
      themeId,
      userId,
      publishedAt: new Date(),
    });

    if (validTags.length > 0) {
      try {
        await db.insert(communityThemeTag).values(
          validTags.map((tag) => ({
            communityThemeId: id,
            tag,
          }))
        );
      } catch (tagError) {
        // Roll back the community theme row if tags insert fails
        await db.delete(communityTheme).where(eq(communityTheme.id, id));
        throw tagError;
      }
    }

    revalidateTag("community-themes");
    revalidateTag("community-tag-counts");

    return actionSuccess({ id });
  } catch (error) {
    logError(error as Error, { action: "publishTheme", themeId });
    throw error;
  }
}

export async function unpublishTheme(
  themeId: string
): Promise<ActionResult<{ success: boolean }>> {
  try {
    const userId = await getCurrentUserId();

    if (!themeId) {
      throw new ValidationError("Theme ID required");
    }

    const [deleted] = await db
      .delete(communityTheme)
      .where(
        and(
          eq(communityTheme.themeId, themeId),
          eq(communityTheme.userId, userId)
        )
      )
      .returning({ id: communityTheme.id });

    if (!deleted) {
      throw new ThemeNotFoundError(
        "Published theme not found or not owned by user"
      );
    }

    revalidateTag("community-themes");
    revalidateTag("community-tag-counts");

    return actionSuccess({ success: true });
  } catch (error) {
    logError(error as Error, { action: "unpublishTheme", themeId });
    throw error;
  }
}

export async function toggleLikeTheme(
  communityThemeId: string
): Promise<ActionResult<{ liked: boolean; likeCount: number }>> {
  try {
    const userId = await getCurrentUserId();

    if (!communityThemeId) {
      throw new ValidationError("Community theme ID required");
    }

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(themeLike)
      .where(
        and(
          eq(themeLike.userId, userId),
          eq(themeLike.themeId, communityThemeId)
        )
      )
      .limit(1);

    if (existingLike) {
      // Unlike: delete + decrement
      await db
        .delete(themeLike)
        .where(
          and(
            eq(themeLike.userId, userId),
            eq(themeLike.themeId, communityThemeId)
          )
        );
      const [updated] = await db
        .update(communityTheme)
        .set({
          likeCount: sql`GREATEST(${communityTheme.likeCount} - 1, 0)`,
        })
        .where(eq(communityTheme.id, communityThemeId))
        .returning({ likeCount: communityTheme.likeCount });

      revalidateTag("community-themes");

      return actionSuccess({
        liked: false,
        likeCount: updated.likeCount,
      });
    } else {
      // Like: insert + increment
      await db.insert(themeLike).values({
        userId,
        themeId: communityThemeId,
        createdAt: new Date(),
      });
      const [updated] = await db
        .update(communityTheme)
        .set({ likeCount: sql`${communityTheme.likeCount} + 1` })
        .where(eq(communityTheme.id, communityThemeId))
        .returning({ likeCount: communityTheme.likeCount });

      revalidateTag("community-themes");

      return actionSuccess({
        liked: true,
        likeCount: updated.likeCount,
      });
    }
  } catch (error) {
    logError(error as Error, {
      action: "toggleLikeTheme",
      communityThemeId,
    });
    throw error;
  }
}

async function fetchCommunityDataForThemeCore(
  themeId: string,
  userId: string | null
): Promise<{
  communityThemeId: string;
  author: { id: string; name: string; image: string | null };
  likeCount: number;
  isLikedByMe: boolean;
  publishedAt: string;
  tags: string[];
} | null> {
  const [result] = await db
    .select({
      id: communityTheme.id,
      publishedAt: communityTheme.publishedAt,
      authorId: userTable.id,
      authorName: userTable.name,
      authorImage: userTable.image,
      likeCount: communityTheme.likeCount,
      ...(userId
        ? {
            isLikedByMe: sql<boolean>`exists(
              select 1 from theme_like
              where theme_like.theme_id = ${communityTheme.id}
              and theme_like.user_id = ${userId}
            )`.as("is_liked_by_me"),
          }
        : {}),
    })
    .from(communityTheme)
    .innerJoin(userTable, eq(communityTheme.userId, userTable.id))
    .where(eq(communityTheme.themeId, themeId))
    .limit(1);

  if (!result) return null;

  const tagRows = await db
    .select({ tag: communityThemeTag.tag })
    .from(communityThemeTag)
    .where(eq(communityThemeTag.communityThemeId, result.id));

  return {
    communityThemeId: result.id,
    author: {
      id: result.authorId,
      name: result.authorName,
      image: result.authorImage,
    },
    likeCount: Number(result.likeCount),
    isLikedByMe:
      "isLikedByMe" in result ? Boolean(result.isLikedByMe) : false,
    publishedAt: result.publishedAt.toISOString(),
    tags: tagRows.map((r) => r.tag),
  };
}

const getCachedCommunityDataForTheme = unstable_cache(
  fetchCommunityDataForThemeCore,
  ["community-theme-data"],
  { revalidate: 60, tags: ["community-themes"] }
);

export async function getCommunityDataForTheme(
  themeId: string
): Promise<{
  communityThemeId: string;
  author: { id: string; name: string; image: string | null };
  likeCount: number;
  isLikedByMe: boolean;
  publishedAt: string;
  tags: string[];
} | null> {
  try {
    const userId = await getOptionalUserId();
    return getCachedCommunityDataForTheme(themeId, userId);
  } catch (error) {
    logError(error as Error, {
      action: "getCommunityDataForTheme",
      themeId,
    });
    return null;
  }
}

export async function getMyPublishedThemeIds(): Promise<string[]> {
  try {
    const userId = await getCurrentUserId();

    const published = await db
      .select({ themeId: communityTheme.themeId })
      .from(communityTheme)
      .where(eq(communityTheme.userId, userId));

    return published.map((p) => p.themeId);
  } catch (error) {
    logError(error as Error, { action: "getMyPublishedThemeIds" });
    throw error;
  }
}

export async function updateCommunityThemeTags(
  themeId: string,
  tags: string[]
): Promise<ActionResult<{ tags: string[] }>> {
  try {
    const userId = await getCurrentUserId();

    if (!themeId) {
      throw new ValidationError("Theme ID required");
    }

    if (tags.length > MAX_TAGS_PER_THEME) {
      throw new ValidationError(
        `You can select at most ${MAX_TAGS_PER_THEME} tags`
      );
    }

    const validTags = tags.filter((t): t is string =>
      (COMMUNITY_THEME_TAGS as readonly string[]).includes(t)
    );

    // Verify ownership via the community_theme row
    const [ct] = await db
      .select({ id: communityTheme.id })
      .from(communityTheme)
      .where(
        and(
          eq(communityTheme.themeId, themeId),
          eq(communityTheme.userId, userId)
        )
      )
      .limit(1);

    if (!ct) {
      throw new ThemeNotFoundError(
        "Published theme not found or not owned by user"
      );
    }

    // Delete existing tags and insert new ones
    await db
      .delete(communityThemeTag)
      .where(eq(communityThemeTag.communityThemeId, ct.id));

    if (validTags.length > 0) {
      await db.insert(communityThemeTag).values(
        validTags.map((tag) => ({
          communityThemeId: ct.id,
          tag,
        }))
      );
    }

    revalidateTag("community-themes");
    revalidateTag("community-tag-counts");

    return actionSuccess({ tags: validTags });
  } catch (error) {
    logError(error as Error, {
      action: "updateCommunityThemeTags",
      themeId,
    });
    throw error;
  }
}

const getCachedTagCounts = unstable_cache(
  async () => {
    const rows = await db
      .select({
        tag: communityThemeTag.tag,
        count: count().as("tag_count"),
      })
      .from(communityThemeTag)
      .groupBy(communityThemeTag.tag)
      .orderBy(sql`tag_count desc`);

    return rows.map((r) => ({ tag: r.tag, count: Number(r.count) }));
  },
  ["community-tag-counts"],
  { revalidate: 300, tags: ["community-tag-counts"] }
);

export async function getCommunityTagCounts(): Promise<
  { tag: string; count: number }[]
> {
  try {
    return getCachedTagCounts();
  } catch (error) {
    logError(error as Error, { action: "getCommunityTagCounts" });
    return [];
  }
}
