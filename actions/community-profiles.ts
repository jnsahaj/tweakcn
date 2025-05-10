"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { community_profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import cuid from "cuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

// Helper to get user ID
async function getCurrentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id ?? null;
}

// Zod schemas
const createCommunityProfileSchema = z.object({
  display_name: z.string().min(1, "Display name cannot be empty"),
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
  social_links: z
    .object({
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  is_active: z.boolean().optional(),
});

// Get all community profiles
export async function getCommunityProfiles() {
  try {
    const profiles = await db.select().from(community_profiles);
    return profiles;
  } catch (error) {
    console.error("Error fetching community profiles:", error);
    throw new Error("Failed to fetch community profiles.");
  }
}

// Get a single community profile by ID
export const getCommunityProfile = cache(async (profileId: string) => {
  try {
    const [profile] = await db
      .select()
      .from(community_profiles)
      .where(eq(community_profiles.id, profileId))
      .limit(1);
    return profile;
  } catch (error) {
    console.error("Error fetching community profile:", error);
    throw new Error("Failed to fetch community profile.");
  }
});

// Create a new community profile
export async function createCommunityProfile(formData: {
  display_name: string;
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
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.format(),
    };
  }
  const { display_name, social_links } = validation.data;
  const newProfileId = cuid();
  const now = new Date();
  try {
    const [insertedProfile] = await db
      .insert(community_profiles)
      .values({
        id: newProfileId,
        display_name,
        user_id: userId,
        created_at: now,
        is_active: true,
        social_links: social_links || {},
      })
      .returning();
    revalidatePath("/community");
    return { success: true, profile: insertedProfile };
  } catch (error) {
    console.error("Error creating community profile:", error);
    return { success: false, error: "Internal Server Error" };
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
    .from(community_profiles)
    .where(eq(community_profiles.id, formData.id));
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
      .update(community_profiles)
      .set(updateData)
      .where(eq(community_profiles.id, id))
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
    .from(community_profiles)
    .where(eq(community_profiles.id, profileId));
  if (!profile) return { success: false, error: "Profile not found" };
  if (profile.user_id !== userId)
    return { success: false, error: "Not owner of community profile" };
  try {
    const [deletedInfo] = await db
      .delete(community_profiles)
      .where(eq(community_profiles.id, profileId))
      .returning({ id: community_profiles.id });
    revalidatePath("/community");
    return { success: true, deletedId: profileId };
  } catch (error) {
    console.error(`Error deleting community profile ${profileId}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}

// Claim a community profile (set claimed_at and user_id if not already claimed)
export async function claimCommunityProfile(profileId: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // Check if already claimed
  const [profile] = await db
    .select()
    .from(community_profiles)
    .where(eq(community_profiles.id, profileId));
  if (!profile) return { success: false, error: "Profile not found" };
  if (profile.user_id) return { success: false, error: "Profile already claimed" };
  try {
    const [updatedProfile] = await db
      .update(community_profiles)
      .set({ user_id: userId, claimed_at: new Date() })
      .where(eq(community_profiles.id, profileId))
      .returning();
    revalidatePath("/community");
    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error(`Error claiming community profile ${profileId}:`, error);
    return { success: false, error: "Internal Server Error" };
  }
}
