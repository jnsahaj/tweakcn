import { db } from "@/db";
import { theme as themeTable } from "@/db/schema";
import { oauthError, requireAuth } from "@/lib/oauth";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ themeId: string }> }
) {
  const auth = await requireAuth(req, "themes:read");
  if (auth.error) return auth.error;

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
      and(eq(themeTable.id, themeId), eq(themeTable.userId, auth.tokenData.userId))
    )
    .limit(1);

  if (!theme) {
    return oauthError("not_found", "Theme not found", 404);
  }

  return Response.json({ data: theme });
}
