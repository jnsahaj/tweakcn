import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { oauthError, requireScope, resolveUserFromBearerToken } from "@/lib/oauth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

/**
 * OpenID Connect-style userinfo endpoint.
 * Returns flat user fields for compatibility with generic OAuth clients
 * (e.g. Better Auth's genericOAuth plugin).
 */
export async function GET(req: NextRequest) {
  const tokenData = await resolveUserFromBearerToken(
    req.headers.get("authorization")
  );

  if (!tokenData) {
    return oauthError("invalid_token", "Invalid or expired access token", 401);
  }

  if (!requireScope(tokenData.scopes, "profile:read")) {
    return oauthError("insufficient_scope", "Requires profile:read scope", 403);
  }

  const [profile] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      image: userTable.image,
    })
    .from(userTable)
    .where(eq(userTable.id, tokenData.userId))
    .limit(1);

  if (!profile) {
    return oauthError("invalid_token", "User not found", 401);
  }

  return Response.json({
    sub: profile.id,
    name: profile.name,
    email: profile.email,
    picture: profile.image,
  });
}
