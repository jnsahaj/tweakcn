/**
 * Create an OAuth app for external integrations.
 *
 * Usage:
 *   npx tsx scripts/create-oauth-app.ts \
 *     --name "My App" \
 *     --redirect-uris "http://localhost:3000/callback,https://myapp.com/callback" \
 *     [--scopes "themes:read,profile:read"] \
 *     [--description "My cool app"]
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { oauthApp } from "../db/schema";
import { generateSecureToken, hashSecret } from "../lib/oauth";
import { randomBytes } from "crypto";
import cuid from "cuid";
import { config } from "dotenv";

config({ path: ".env.local" });

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, "");
    parsed[key] = args[i + 1];
  }

  return parsed;
}

async function main() {
  const args = parseArgs();

  if (!args.name || !args["redirect-uris"]) {
    console.error(
      "Usage: npx tsx scripts/create-oauth-app.ts --name <name> --redirect-uris <uri1,uri2> [--scopes <scope1,scope2>] [--description <desc>]"
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set. Make sure .env.local exists.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle({ client: sql });

  const clientId = randomBytes(16).toString("hex");
  const clientSecret = generateSecureToken();
  const clientSecretHash = await hashSecret(clientSecret);

  const redirectUris = args["redirect-uris"].split(",").map((u) => u.trim());
  const scopes = args.scopes
    ? args.scopes.split(",").map((s) => s.trim())
    : ["themes:read", "profile:read"];

  const now = new Date();

  await db.insert(oauthApp).values({
    id: cuid(),
    name: args.name,
    description: args.description ?? null,
    clientId,
    clientSecretHash,
    redirectUris,
    scopes,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  console.log("\nOAuth app created successfully!\n");
  console.log("  Name:          ", args.name);
  console.log("  Client ID:     ", clientId);
  console.log("  Client Secret: ", clientSecret);
  console.log("  Redirect URIs: ", redirectUris.join(", "));
  console.log("  Scopes:        ", scopes.join(", "));
  console.log(
    "\n  ⚠️  Save the client secret now — it cannot be retrieved later.\n"
  );
}

main().catch((err) => {
  console.error("Failed to create OAuth app:", err);
  process.exit(1);
});
