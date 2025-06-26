"use server";

import { z } from "zod";
import { db } from "@/db";
import {
  theme as themeTable,
  themeLike as themeLikeTable,
  tag as tagTable,
  themeTag as themeTagTable,
  user as userTable,
} from "@/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import cuid from "cuid";
import {
  UnauthorizedError,
  ValidationError,
  ThemeNotFoundError,
  ThemeLimitError,
} from "@/types/errors";
import { getCurrentUserId, logError } from "./shared";
import { buildPaginatedResponse } from "@/utils/pagination";

const publishThemeSchema = z.object({
  themeId: z.string().min(1, "Theme ID required"),
  tags: z.array(z.string().min(1)).optional(),
});

const toggleLikeSchema = z.object({
  themeId: z.string().min(1, "Theme ID required"),
});

const addTagsSchema = z.object({
  themeId: z.string().min(1, "Theme ID required"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
});

export async function publishThemeToCommunity(formData: { themeId: string; tags?: string[] }) {
  try {
    const userId = await getCurrentUserId();

    const validation = publishThemeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    const { themeId, tags } = validation.data;

    // Ensure theme exists and is owned by user
    const [theme] = await db
      .select()
      .from(themeTable)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.userId, userId)))
      .limit(1);

    if (!theme) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    if (theme.isCommunity) {
      throw new ValidationError("Theme is already published to community");
    }

    // Check user community theme quota
    const publishedThemes = await db
      .select()
      .from(themeTable)
      .where(and(eq(themeTable.userId, userId), eq(themeTable.isCommunity, true)));

    if (publishedThemes.length >= 3) {
      // Check if user is whitelisted
      const [user] = await db
        .select({ isWhitelisted: userTable.isWhitelisted })
        .from(userTable)
        .where(eq(userTable.id, userId));

      const isWhitelisted = user?.isWhitelisted ?? false;

      if (!isWhitelisted) {
        throw new ThemeLimitError("You can only publish up to 3 themes to the community");
      }
    }

    // Update theme as community
    const now = new Date();
    const [updatedTheme] = await db
      .update(themeTable)
      .set({ isCommunity: true, publishedAt: now, updatedAt: now })
      .where(eq(themeTable.id, themeId))
      .returning();

    if (!updatedTheme) {
      throw new ThemeNotFoundError("Theme not found after update");
    }

    // Handle tags if provided
    if (tags && tags.length > 0) {
      await addTagsToTheme({ themeId, tags });
    }

    return updatedTheme;
  } catch (error) {
    logError(error as Error, { action: "publishThemeToCommunity", formData });
    throw error;
  }
}

export async function toggleThemeLike(formData: { themeId: string }) {
  try {
    const userId = await getCurrentUserId();

    const validation = toggleLikeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    const { themeId } = validation.data;

    // Ensure theme exists and is community
    const [theme] = await db
      .select({ id: themeTable.id })
      .from(themeTable)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.isCommunity, true)))
      .limit(1);

    if (!theme) {
      throw new ThemeNotFoundError("Community theme not found");
    }

    // Check if like exists
    const [existingLike] = await db
      .select()
      .from(themeLikeTable)
      .where(and(eq(themeLikeTable.themeId, themeId), eq(themeLikeTable.userId, userId)))
      .limit(1);

    let liked: boolean;

    if (existingLike) {
      // Unlike
      await db
        .delete(themeLikeTable)
        .where(and(eq(themeLikeTable.themeId, themeId), eq(themeLikeTable.userId, userId)));

      await db
        .update(themeTable)
        .set({ likeCount: sql`"like_count" - 1` })
        .where(eq(themeTable.id, themeId));

      liked = false;
    } else {
      const now = new Date();
      await db.insert(themeLikeTable).values({ themeId, userId, likedAt: now });

      await db
        .update(themeTable)
        .set({ likeCount: sql`"like_count" + 1` })
        .where(eq(themeTable.id, themeId));

      liked = true;
    }

    return { liked };
  } catch (error) {
    logError(error as Error, { action: "toggleThemeLike", formData });
    throw error;
  }
}

export async function addTagsToTheme(formData: { themeId: string; tags: string[] }) {
  try {
    const userId = await getCurrentUserId();

    const validation = addTagsSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    const { themeId, tags } = validation.data;

    // Ensure the theme exists and caller owns it (for adding tags). We don't restrict if theme already community and user not owner; but we keep this for safety.
    const [theme] = await db
      .select({ id: themeTable.id, userId: themeTable.userId })
      .from(themeTable)
      .where(eq(themeTable.id, themeId))
      .limit(1);

    if (!theme) {
      throw new ThemeNotFoundError();
    }

    if (theme.userId !== userId) {
      throw new UnauthorizedError();
    }

    const now = new Date();

    // Ensure tags exist
    for (const tagName of tags) {
      // use slug equal to lowercase hyphen separated
      const slug = tagName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");

      // Insert tag if not exists
      await db
        .insert(tagTable)
        .values({ id: cuid(), name: tagName, slug, createdAt: now })
        .onConflictDoNothing();

      // Fetch tag id
      const [tag] = await db
        .select({ id: tagTable.id })
        .from(tagTable)
        .where(eq(tagTable.slug, slug));
      if (!tag) continue;

      // Associate with theme
      await db
        .insert(themeTagTable)
        .values({ themeId, tagId: tag.id, createdAt: now })
        .onConflictDoNothing();
    }

    return { ok: true };
  } catch (error) {
    logError(error as Error, { action: "addTagsToTheme", formData: { themeId: formData.themeId } });
    throw error;
  }
}

export async function getFeaturedThemes(limit: number = 10, cursor?: string) {
  try {
    const conditions = [eq(themeTable.isCommunity, true), eq(themeTable.featured, true)];

    if (cursor) {
      conditions.push(sql`id > ${cursor}`);
    }

    const themes = await db
      .select()
      .from(themeTable)
      .where(and(...conditions))
      .orderBy(desc(themeTable.featuredAt))
      .limit(limit);

    return buildPaginatedResponse(themes, limit);
  } catch (error) {
    logError(error as Error, { action: "getFeaturedThemes" });
    throw error;
  }
}

export async function getPopularThemes(limit: number = 10, cursor?: string) {
  try {
    const conditions = [eq(themeTable.isCommunity, true)];
    if (cursor) {
      conditions.push(sql`id > ${cursor}`);
    }

    const themes = await db
      .select()
      .from(themeTable)
      .where(and(...conditions))
      .orderBy(desc(themeTable.likeCount), desc(themeTable.publishedAt))
      .limit(limit);

    return buildPaginatedResponse(themes, limit);
  } catch (error) {
    logError(error as Error, { action: "getPopularThemes" });
    throw error;
  }
}

export async function getCommunityThemesByTag(
  tagSlug: string,
  limit: number = 10,
  cursor?: string
) {
  try {
    if (!tagSlug) {
      throw new ValidationError("Tag slug required");
    }

    const baseQuery = db
      .select({
        id: themeTable.id,
        userId: themeTable.userId,
        name: themeTable.name,
        styles: themeTable.styles,
        createdAt: themeTable.createdAt,
        updatedAt: themeTable.updatedAt,
        isCommunity: themeTable.isCommunity,
        publishedAt: themeTable.publishedAt,
        featured: themeTable.featured,
        featuredAt: themeTable.featuredAt,
        likeCount: themeTable.likeCount,
      })
      .from(themeTable)
      .innerJoin(themeTagTable, eq(themeTagTable.themeId, themeTable.id))
      .innerJoin(tagTable, eq(tagTable.id, themeTagTable.tagId));

    const conditions = [eq(themeTable.isCommunity, true), eq(tagTable.slug, tagSlug)];

    if (cursor) {
      conditions.push(sql`"theme"."id" > ${cursor}`);
    }

    const themes = await baseQuery
      .where(and(...conditions))
      .orderBy(desc(themeTable.likeCount))
      .limit(limit);

    return buildPaginatedResponse(themes, limit);
  } catch (error) {
    logError(error as Error, { action: "getCommunityThemesByTag", tagSlug });
    throw error;
  }
}
