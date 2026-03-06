import { db } from "@/db";
import { oauthApp } from "@/db/schema";
import { oauthError } from "@/lib/oauth";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("client_id");

  if (!clientId) {
    return oauthError("invalid_request", "Missing client_id");
  }

  const [app] = await db
    .select({ name: oauthApp.name, description: oauthApp.description })
    .from(oauthApp)
    .where(and(eq(oauthApp.clientId, clientId), eq(oauthApp.isActive, true)))
    .limit(1);

  if (!app) {
    return oauthError("invalid_client", "Unknown client_id");
  }

  return Response.json({ name: app.name, description: app.description });
}
