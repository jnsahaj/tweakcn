import { db } from "@/db";
import { theme as themeTable } from "@/db/schema";
import { oauthError, requireScope, resolveUserFromBearerToken } from "@/lib/oauth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const tokenData = await resolveUserFromBearerToken(
    req.headers.get("authorization")
  );

  if (!tokenData) {
    return oauthError("invalid_token", "Invalid or expired access token", 401);
  }

  if (!requireScope(tokenData.scopes, "themes:read")) {
    return oauthError("insufficient_scope", "Requires themes:read scope", 403);
  }

  const themes = await db
    .select({
      id: themeTable.id,
      name: themeTable.name,
      styles: themeTable.styles,
      createdAt: themeTable.createdAt,
      updatedAt: themeTable.updatedAt,
    })
    .from(themeTable)
    .where(eq(themeTable.userId, tokenData.userId));

  return Response.json({ data: themes });
}
