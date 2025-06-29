"use server";

import { z } from "zod";
import { db } from "@/db";
import { theme as themeTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import cuid from "cuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { themeStylesSchema, type ThemeStyles } from "@/types/theme";
import { cache } from "react";
import {
  UnauthorizedError,
  ValidationError,
  ThemeNotFoundError,
  ThemeLimitError,
} from "@/types/errors";

// Helper to get user ID with better error handling
async function getCurrentUserId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  return session.user.id;
}

// Log errors for observability
function logError(error: Error, context: Record<string, any>) {
  console.error("Theme action error:", error, context);

  // TODO: Add server-side error reporting to PostHog or your preferred service
  // For production, you'd want to send critical errors to an external service
  if (error.name === "UnauthorizedError" || error.name === "ValidationError") {
    // These are expected errors, log but don't report
    console.warn("Expected error:", { error: error.message, context });
  } else {
    // Unexpected errors should be reported
    console.error("Unexpected error:", { error: error.message, stack: error.stack, context });
  }
}

const createThemeSchema = z.object({
  name: z.string().min(1, "Theme name cannot be empty").max(50, "Theme name too long"),
  styles: themeStylesSchema,
});

const updateThemeSchema = z.object({
  id: z.string().min(1, "Theme ID required"),
  name: z.string().min(1, "Theme name cannot be empty").max(50, "Theme name too long").optional(),
  styles: themeStylesSchema.optional(),
});

// Layer 1: Clean server actions with proper error handling
export async function getThemes() {
  try {
    const userId = await getCurrentUserId();
    const userThemes = await db.select().from(themeTable).where(eq(themeTable.userId, userId));
    return userThemes;
  } catch (error) {
    logError(error as Error, { action: "getThemes" });
    throw error;
  }
}

export const getTheme = cache(async (themeId: string) => {
  try {
    if (!themeId) {
      throw new ValidationError("Theme ID required");
    }

    const [theme] = await db.select().from(themeTable).where(eq(themeTable.id, themeId)).limit(1);

    if (!theme) {
      throw new ThemeNotFoundError();
    }

    return theme;
  } catch (error) {
    logError(error as Error, { action: "getTheme", themeId });
    throw error;
  }
});

export async function createTheme(formData: { name: string; styles: ThemeStyles }) {
  try {
    const userId = await getCurrentUserId();

    const validation = createThemeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    // Check theme limit
    const userThemes = await db.select().from(themeTable).where(eq(themeTable.userId, userId));
    if (userThemes.length >= 10) {
      throw new ThemeLimitError("You cannot have more than 10 themes yet.");
    }

    const { name, styles } = validation.data;
    const newThemeId = cuid();
    const now = new Date();

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

    return insertedTheme;
  } catch (error) {
    logError(error as Error, { action: "createTheme", formData: { name: formData.name } });
    throw error;
  }
}

export async function updateTheme(formData: { id: string; name?: string; styles?: ThemeStyles }) {
  try {
    const userId = await getCurrentUserId();

    const validation = updateThemeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    const { id: themeId, name, styles } = validation.data;

    if (!name && !styles) {
      throw new ValidationError("No update data provided");
    }

    const updateData: Partial<typeof themeTable.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (name) updateData.name = name;
    if (styles) updateData.styles = styles;

    const [updatedTheme] = await db
      .update(themeTable)
      .set(updateData)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.userId, userId)))
      .returning();

    if (!updatedTheme) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    return updatedTheme;
  } catch (error) {
    logError(error as Error, { action: "updateTheme", themeId: formData.id });
    throw error;
  }
}

export async function deleteTheme(themeId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!themeId) {
      throw new ValidationError("Theme ID required");
    }

    const [deletedTheme] = await db
      .delete(themeTable)
      .where(and(eq(themeTable.id, themeId), eq(themeTable.userId, userId)))
      .returning({ id: themeTable.id, name: themeTable.name });

    if (!deletedTheme) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    return deletedTheme;
  } catch (error) {
    logError(error as Error, { action: "deleteTheme", themeId });
    throw error;
  }
}
