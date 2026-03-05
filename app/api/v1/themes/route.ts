import { db } from "@/db";
import { theme as themeTable } from "@/db/schema";
import { requireAuth } from "@/lib/oauth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, "themes:read");
  if (auth.error) return auth.error;

  const themes = await db
    .select({
      id: themeTable.id,
      name: themeTable.name,
      styles: themeTable.styles,
      createdAt: themeTable.createdAt,
      updatedAt: themeTable.updatedAt,
    })
    .from(themeTable)
    .where(eq(themeTable.userId, auth.tokenData.userId));

  return Response.json({ data: themes });
}
