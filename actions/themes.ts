"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { theme as themeTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import cuid from "cuid";
import { themeStylesSchema, type ThemeStyles } from "@/types/theme";
import { cache } from "react";
import { getCurrentUserId } from "@/lib/auth";

const createThemeSchema = z.object({
  name: z.string().min(1, "Theme name cannot be empty"),
  styles: themeStylesSchema,
});

const updateThemeSchema = z.object({
  id: z.string(), // ID is needed to know which theme to update
  name: z.string().min(1, "Theme name cannot be empty").optional(),
  styles: themeStylesSchema.optional(),
});

export async function getThemes() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const userThemes = await db.select().from(themeTable).where(eq(themeTable.userId, userId));
    return userThemes;
  } catch (error) {
    console.error("Error fetching themes:", error);
    throw new Error("Failed to fetch themes."); // Propagate a generic error
  }
}

// Wrap getTheme with React.cache
export const getTheme = cache(async (themeId: string) => {
  try {
    const [theme] = await db.select().from(themeTable).where(eq(themeTable.id, themeId)).limit(1);

    return theme;
  } catch (error) {
    console.error("Error fetching theme:", error);
    throw new Error("Failed to fetch theme.");
  }
});

export const getThemeWithCommunity = cache(async (themeId: string) => {
  try {
    const currentUserId = await getCurrentUserId();
    
    const { community_theme, community_profile, theme_like, user } = await import("@/db/schema");
    const { sql, and, eq } = await import("drizzle-orm");
    
    const [result] = await db
      .select({
        theme: themeTable,
        communityThemeId: community_theme.id,
        communityThemeCreatedAt: community_theme.created_at,
        communityThemeLikesCount: community_theme.likes_count,
        communityProfileId: community_profile.id,
        communityProfileName: community_profile.display_name,
        communityProfileImage: user.image,
        isLiked: currentUserId
          ? sql<boolean>`EXISTS (
              SELECT 1 FROM ${theme_like} 
              WHERE ${theme_like.community_theme_id} = ${community_theme.id} 
              AND ${theme_like.user_id} = ${currentUserId}
            )`.as("is_liked")
          : sql<boolean>`FALSE`.as("is_liked"),
      })
      .from(themeTable)
      .leftJoin(
        community_theme,
        eq(themeTable.id, community_theme.theme_id)
      )
      .leftJoin(
        community_profile,
        eq(community_theme.community_profile_id, community_profile.id)
      )
      .leftJoin(
        user,
        eq(community_profile.user_id, user.id)
      )
      .where(eq(themeTable.id, themeId))
      .limit(1);

    if (!result) return null;
    
    const communityTheme = result.communityThemeId 
      ? {
          id: result.communityThemeId,
          created_at: result.communityThemeCreatedAt || new Date(),
          likes_count: result.communityThemeLikesCount || 0,
          is_liked: !!result.isLiked,
          community_profile: {
            id: result.communityProfileId || "",
            name: result.communityProfileName,
            image: result.communityProfileImage,
          },
          theme: {
            id: result.theme.id,
            name: result.theme.name,
            styles: result.theme.styles,
          }
        }
      : null;
    
    return {
      theme: result.theme,
      communityTheme
    };
  } catch (error) {
    console.error("Error fetching theme with community data:", error);
    return null;
  }
});

// Action to create a new theme
export async function createTheme(formData: { name: string; styles: ThemeStyles }) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validation = createThemeSchema.safeParse(formData);
  if (!validation.success) {
    // Return validation errors for the client to handle
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.format(),
    };
  }

  // Check if user already has 10 themes
  const userThemes = await db.select().from(themeTable).where(eq(themeTable.userId, userId));

  if (userThemes.length >= 10) {
    return {
      success: false,
      error: "Theme limit reached",
      message: "You cannot have more than 10 themes yet.",
    };
  }

  const { name, styles } = validation.data;
  const newThemeId = cuid();
  const now = new Date();

  try {
    const [insertedTheme] = await db
      .insert(themeTable)
      .values({
        id: newThemeId,
        userId: userId,
        name: name,
        styles: styles, // Already validated
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    revalidatePath("/"); // Or a more specific path where themes are displayed
    return {
      success: true,
      theme: insertedTheme,
    };
  } catch (error) {
    console.error("Error creating theme:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Action to update an existing theme
export async function updateTheme(formData: { id: string; name?: string; styles?: ThemeStyles }) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validation = updateThemeSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.format(),
    };
  }

  const { id: themeId, name, styles } = validation.data;

  if (!name && !styles) {
    return { success: false, error: "No update data provided" };
  }

  const updateData: Partial<typeof themeTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (name) updateData.name = name;
  if (styles) updateData.styles = styles; // Already validated

  try {
    const [updatedTheme] = await db
      .update(themeTable)
      .set(updateData)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.userId, userId)))
      .returning();

    if (!updatedTheme) {
      return { success: false, error: "Theme not found or not owned by user" };
    }

    revalidatePath("/"); // Or a more specific path
    return {
      success: true,
      theme: updatedTheme,
    };
  } catch (error) {
    console.error(`Error updating theme ${themeId}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Action to delete a theme
export async function deleteTheme(themeId: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!themeId) {
    return { success: false, error: "Theme ID required" };
  }

  try {
    const [deletedInfo] = await db
      .delete(themeTable)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.userId, userId)))
      .returning({ id: themeTable.id });

    if (!deletedInfo) {
      return { success: false, error: "Theme not found or not owned by user" };
    }

    revalidatePath("/dashboard"); // Or a more specific path
    return { success: true, deletedId: themeId };
  } catch (error) {
    console.error(`Error deleting theme ${themeId}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}
