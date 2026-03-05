import { db } from "@/db";
import { theme as themeTable } from "@/db/schema";
import { oauthError, requireScope, resolveUserFromBearerToken } from "@/lib/oauth";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ themeId: string }> }
) {
  const tokenData = await resolveUserFromBearerToken(
    req.headers.get("authorization")
  );

  if (!tokenData) {
    return oauthError("invalid_token", "Invalid or expired access token", 401);
  }

  if (!requireScope(tokenData.scopes, "themes:read")) {
    return oauthError("insufficient_scope", "Requires themes:read scope", 403);
  }

  const { themeId } = await params;

  const [theme] = await db
    .select({
      id: themeTable.id,
      name: themeTable.name,
      styles: themeTable.styles,
      createdAt: themeTable.createdAt,
      updatedAt: themeTable.updatedAt,
    })
    .from(themeTable)
    .where(
      and(eq(themeTable.id, themeId), eq(themeTable.userId, tokenData.userId))
    )
    .limit(1);

  if (!theme) {
    return Response.json(
      { error: "not_found", error_description: "Theme not found" },
      { status: 404 }
    );
  }

  return Response.json({ data: theme });
}
