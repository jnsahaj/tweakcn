"use server";

import { z } from "zod";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId, logError } from "./shared";
import { ValidationError } from "@/types/errors";

const updateProfileSchema = z
  .object({
    name: z.string().min(1, "Name cannot be empty").max(50, "Name too long").optional(),
    bio: z.string().max(280, "Bio too long").optional(),
    twitterUrl: z.string().url("Invalid Twitter URL").optional(),
    githubUrl: z.string().url("Invalid GitHub URL").optional(),
    websiteUrl: z.string().url("Invalid website URL").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No update data provided",
  });

export async function getUserProfile() {
  try {
    const userId = await getCurrentUserId();
    const [currentUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    if (!currentUser) {
      throw new ValidationError("User not found");
    }
    return currentUser;
  } catch (error) {
    logError(error as Error, { action: "getUserProfile" });
    throw error;
  }
}

export async function updateUserProfile(formData: {
  name?: string;
  bio?: string;
  twitterUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}) {
  try {
    const userId = await getCurrentUserId();

    const validation = updateProfileSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    const updateData: Partial<typeof userTable.$inferInsert> = {
      ...validation.data,
      updatedAt: new Date(),
    };

    const [updatedUser] = await db
      .update(userTable)
      .set(updateData)
      .where(eq(userTable.id, userId))
      .returning();

    if (!updatedUser) {
      throw new ValidationError("User not found");
    }

    return updatedUser;
  } catch (error) {
    logError(error as Error, { action: "updateUserProfile", formData });
    throw error;
  }
}
