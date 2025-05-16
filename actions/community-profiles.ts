"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { community_profile, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import cuid from "cuid";
import { cache } from "react";
import { getCurrentUserId } from "@/lib/auth";

// Zod schemas
const createCommunityProfileSchema = z.object({
  display_name: z.string().min(1, "Display name cannot be empty"),
  bio: z.string().optional(),
  image: z.string().optional(),
  social_links: z
    .object({
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

const updateCommunityProfileSchema = z.object({
  id: z.string(),
  display_name: z.string().min(1, "Display name cannot be empty").optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  social_links: z
    .object({
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  is_active: z.boolean().optional(),
});

// Get a single community profile by ID
export const getCommunityProfile = cache(async (profileId: string) => {
  try {
    const [profile] = await db
      .select()
      .from(community_profile)
      .where(eq(community_profile.id, profileId))
      .limit(1);
    return profile;
  } catch (error) {
    console.error("Error fetching community profile:", error);
    throw new Error("Failed to fetch community profile.");
  }
});

export const getMyCommunityProfile = cache(async () => {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const [profile] = await db
      .select()
      .from(community_profile)
      .where(eq(community_profile.user_id, userId))
      .limit(1);

    // If profile doesn't exist, create a new one
    if (!profile) {
      // First fetch the user details
      const [userData] = await db.select().from(user).where(eq(user.id, userId)).limit(1);

      if (!userData) {
        throw new Error("User not found");
      }

      const result = await createCommunityProfile({
        display_name: userData.name,
        image: userData.image || undefined,
      });

      if (!result) {
        throw new Error("Failed to create community profile");
      }

      return result;
    }

    return profile;
  } catch (error) {
    console.error("Error fetching community profile for user:", error);
    throw new Error("Failed to fetch community profile for user.");
  }
});

// Create a new community profile
export async function createCommunityProfile(formData: {
  display_name: string;
  bio?: string;
  image?: string;
  social_links?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const validation = createCommunityProfileSchema.safeParse(formData);
  if (!validation.success) {
    throw new Error("Invalid input");
  }
  const { display_name, social_links, bio, image } = validation.data;
  const newProfileId = cuid();
  const now = new Date();
  try {
    const [insertedProfile] = await db
      .insert(community_profile)
      .values({
        id: newProfileId,
        display_name,
        user_id: userId,
        bio,
        image,
        created_at: now,
        is_active: true,
        social_links: social_links || {},
      })
      .returning();
    revalidatePath("/community");
    return insertedProfile;
  } catch (error) {
    console.error("Error creating community profile:", error);
    throw new Error("Internal Server Error");
  }
}

// Update a community profile (only by owner)
export async function updateCommunityProfile(formData: {
  id: string;
  display_name?: string;
  social_links?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  is_active?: boolean;
}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // Check ownership
  const [profile] = await db
    .select()
    .from(community_profile)
    .where(eq(community_profile.id, formData.id));
  if (!profile) return { success: false, error: "Profile not found" };

  if (profile.user_id !== userId)
    return { success: false, error: "Not owner of community profile" };
  const validation = updateCommunityProfileSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.format(),
    };
  }
  const { id, display_name, social_links, is_active } = validation.data;
  if (!display_name && !social_links && typeof is_active === "undefined") {
    return { success: false, error: "No update data provided" };
  }
  const updateData: any = {};
  if (display_name) updateData.display_name = display_name;
  if (social_links) updateData.social_links = social_links;
  if (typeof is_active !== "undefined") updateData.is_active = is_active;
  try {
    const [updatedProfile] = await db
      .update(community_profile)
      .set(updateData)
      .where(eq(community_profile.id, id))
      .returning();
    revalidatePath("/community");
    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error(`Error updating community profile ${id}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Delete a community profile (only by owner)
export async function deleteCommunityProfile(profileId: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // Check ownership
  const [profile] = await db
    .select()
    .from(community_profile)
    .where(eq(community_profile.id, profileId));
  if (!profile) return { success: false, error: "Profile not found" };
  if (profile.user_id !== userId)
    return { success: false, error: "Not owner of community profile" };
  try {
    const [deletedInfo] = await db
      .delete(community_profile)
      .where(eq(community_profile.id, profileId))
      .returning({ id: community_profile.id });
    revalidatePath("/community");
    return { success: true, deletedId: profileId };
  } catch (error) {
    console.error(`Error deleting community profile ${profileId}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}
