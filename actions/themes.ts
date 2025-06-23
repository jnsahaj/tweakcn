"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { theme as themeTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import cuid from "cuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers"; // Keep for session, but actions handle auth differently
import { themeStylesSchema, type ThemeStyles } from "@/types/theme";
import { cache } from "react";

// Helper to get user ID (Consider centralizing auth checks)
async function getCurrentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return session?.user?.id ?? null;
}

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
  if (!db) {
    return [];
  }
  
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const userThemes = await db
      .select()
      .from(themeTable)
      .where(eq(themeTable.userId, userId));
    return userThemes;
  } catch (error) {
    console.error("Error fetching themes:", error);
    throw new Error("Failed to fetch themes.");
  }
}

// Wrap getTheme with React.cache
export const getTheme = cache(async (themeId: string) => {
  if (!db) {
    return null;
  }
  
  try {
    const [theme] = await db
      .select()
      .from(themeTable)
      .where(eq(themeTable.id, themeId))
      .limit(1);

    return theme;
  } catch (error) {
    console.error("Error fetching theme:", error);
    throw new Error("Failed to fetch theme.");
  }
});

// Action to create a new theme
export async function createTheme(formData: {
  name: string;
  styles: ThemeStyles;
}) {
  if (!db) {
    return { success: false, error: "Database not available" };
  }
  
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validation = createThemeSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.format(),
    };
  }

  const userThemes = await db
    .select()
    .from(themeTable)
    .where(eq(themeTable.userId, userId));

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
        styles: styles,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    revalidatePath("/");
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
export async function updateTheme(formData: {
  id: string;
  name?: string;
  styles?: ThemeStyles;
}) {
  if (!db) {
    return { success: false, error: "Database not available" };
  }
  
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
  if (styles) updateData.styles = styles;

  try {
    const [updatedTheme] = await db
      .update(themeTable)
      .set(updateData)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.userId, userId)))
      .returning();

    if (!updatedTheme) {
      return { success: false, error: "Theme not found or not owned by user" };
    }

    revalidatePath("/");
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
  if (!db) {
    return { success: false, error: "Database not available" };
  }
  
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

    revalidatePath("/dashboard");
    return { success: true, deletedId: themeId };
  } catch (error) {
    console.error(`Error deleting theme ${themeId}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}
