"use server";

import { db } from "@/db";
import { user as userTable, subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/shared";
import { logError } from "@/lib/shared";
import { actionError, actionSuccess, ErrorCode, type ActionResult } from "@/types/errors";
import { polar } from "@/lib/polar";

export async function deleteAccount(): Promise<ActionResult<boolean>> {
  try {
    const userId = await getCurrentUserId();

    // Try to delete Polar customer (cancels subscriptions + revokes benefits)
    // Free users won't have a Polar customer, so we catch and ignore errors
    try {
      await polar.customers.deleteExternal({ externalId: userId });
    } catch (_e) {
      // Expected for free users — no Polar customer exists
    }

    // Delete subscription records (no CASCADE on this table)
    await db.delete(subscription).where(eq(subscription.userId, userId));

    // Delete user — CASCADE handles: sessions, accounts, themes,
    // communityThemes, communityThemeTags, themeLikes, aiUsage,
    // oauthAuthorizationCode, oauthToken
    await db.delete(userTable).where(eq(userTable.id, userId));

    return actionSuccess(true);
  } catch (error) {
    logError(error as Error, { action: "deleteAccount" });
    return actionError(ErrorCode.UNKNOWN_ERROR, "Failed to delete account. Please try again.");
  }
}
