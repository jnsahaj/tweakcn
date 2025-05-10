"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { community_theme, theme_like, theme_moderation, community_profile } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import cuid from "cuid";
import { themeStylesSchema, type ThemeStyles } from "@/types/theme";
import { cache } from "react";
import { getCurrentUserId } from "@/lib/auth";

// Zod schemas
const createCommunityThemeSchema = z.object({
  community_profile_id: z.string(),
  name: z.string().min(1, "Theme name cannot be empty"),
  styles: themeStylesSchema,
});

const updateCommunityThemeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Theme name cannot be empty").optional(),
  styles: themeStylesSchema.optional(),
});

// Get all community themes (optionally filter by status)
export async function getCommunityThemes({
  status,
}: { status?: "pending_review" | "approved" | "rejected" } = {}) {
  try {
    let themes;
    if (status) {
      themes = await db.select().from(community_theme).where(eq(community_theme.status, status));
    } else {
      themes = await db.select().from(community_theme);
    }
    return themes;
  } catch (error) {
    console.error("Error fetching community themes:", error);
    throw new Error("Failed to fetch community themes.");
  }
}

// Get a single community theme by ID
export const getCommunityTheme = cache(async (themeId: string) => {
  try {
    const [theme] = await db
      .select()
      .from(community_theme)
      .where(eq(community_theme.id, themeId))
      .limit(1);
    return theme;
  } catch (error) {
    console.error("Error fetching community theme:", error);
    throw new Error("Failed to fetch community theme.");
  }
});

// Create a new community theme
export async function createCommunityTheme(formData: {
  community_profile_id: string;
  name: string;
  styles: ThemeStyles;
}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // Check if user owns the community profile
  const profile = await db
    .select()
    .from(community_profile)
    .where(
      and(
        eq(community_profile.id, formData.community_profile_id),
        eq(community_profile.user_id, userId)
      )
    )
    .limit(1);
  if (!profile.length) {
    return { success: false, error: "Not owner of community profile" };
  }
  const validation = createCommunityThemeSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.format(),
    };
  }
  const { community_profile_id, name, styles } = validation.data;
  const newThemeId = cuid();
  const now = new Date();
  try {
    const [insertedTheme] = await db
      .insert(community_theme)
      .values({
        id: newThemeId,
        community_profile_id,
        name,
        styles,
        created_at: now,
        status: "pending_review",
        likes_count: 0,
      })
      .returning();
    revalidatePath("/community");
    return { success: true, theme: insertedTheme };
  } catch (error) {
    console.error("Error creating community theme:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Update a community theme (only by owner)
export async function updateCommunityTheme(formData: {
  id: string;
  name?: string;
  styles?: ThemeStyles;
}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // Check ownership
  const [theme] = await db
    .select()
    .from(community_theme)
    .where(eq(community_theme.id, formData.id));
  if (!theme) return { success: false, error: "Theme not found" };
  const [profile] = await db
    .select()
    .from(community_profile)
    .where(
      and(
        eq(community_profile.id, theme.community_profile_id),
        eq(community_profile.user_id, userId)
      )
    );
  if (!profile) return { success: false, error: "Not owner of community profile" };
  const validation = updateCommunityThemeSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.format(),
    };
  }
  const { id, name, styles } = validation.data;
  if (!name && !styles) {
    return { success: false, error: "No update data provided" };
  }
  const updateData: any = {};
  if (name) updateData.name = name;
  if (styles) updateData.styles = styles;
  try {
    const [updatedTheme] = await db
      .update(community_theme)
      .set(updateData)
      .where(eq(community_theme.id, id))
      .returning();
    revalidatePath("/community");
    return { success: true, theme: updatedTheme };
  } catch (error) {
    console.error(`Error updating community theme ${id}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Delete a community theme (only by owner)
export async function deleteCommunityTheme(themeId: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // Check ownership
  const [theme] = await db.select().from(community_theme).where(eq(community_theme.id, themeId));
  if (!theme) return { success: false, error: "Theme not found" };
  const [profile] = await db
    .select()
    .from(community_profile)
    .where(
      and(
        eq(community_profile.id, theme.community_profile_id),
        eq(community_profile.user_id, userId)
      )
    );
  if (!profile) return { success: false, error: "Not owner of community profile" };
  try {
    const [deletedInfo] = await db
      .delete(community_theme)
      .where(eq(community_theme.id, themeId))
      .returning({ id: community_theme.id });
    revalidatePath("/community");
    return { success: true, deletedId: themeId };
  } catch (error) {
    console.error(`Error deleting community theme ${themeId}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Like a community theme
export async function likeCommunityTheme(themeId: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");
  try {
    await db.insert(theme_like).values({
      user_id: userId,
      community_theme_id: themeId,
      created_at: new Date(),
    });
    // Increment likes_count safely
    const [theme] = await db.select().from(community_theme).where(eq(community_theme.id, themeId));
    if (theme) {
      await db
        .update(community_theme)
        .set({ likes_count: (theme.likes_count || 0) + 1 })
        .where(eq(community_theme.id, themeId));
    }
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Error liking community theme:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Unlike a community theme
export async function unlikeCommunityTheme(themeId: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");
  try {
    await db
      .delete(theme_like)
      .where(and(eq(theme_like.user_id, userId), eq(theme_like.community_theme_id, themeId)));
    // Decrement likes_count safely
    const [theme] = await db.select().from(community_theme).where(eq(community_theme.id, themeId));
    if (theme && theme.likes_count > 0) {
      await db
        .update(community_theme)
        .set({ likes_count: theme.likes_count - 1 })
        .where(eq(community_theme.id, themeId));
    }
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Error unliking community theme:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Moderate a community theme (admin only)
export async function moderateCommunityTheme({
  themeId,
  status,
  feedback,
}: {
  themeId: string;
  status: "approved" | "rejected";
  feedback?: string;
}) {
  const userId = await getCurrentUserId();
  // TODO: Add admin check here
  if (!userId /* || !isAdmin(userId) */) {
    throw new Error("Unauthorized");
  }
  try {
    const [moderation] = await db
      .insert(theme_moderation)
      .values({
        id: cuid(),
        community_theme_id: themeId,
        admin_user_id: userId,
        status,
        feedback,
        moderated_at: new Date(),
      })
      .returning();
    await db.update(community_theme).set({ status }).where(eq(community_theme.id, themeId));
    revalidatePath("/community");
    return { success: true, moderation };
  } catch (error) {
    console.error("Error moderating community theme:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
