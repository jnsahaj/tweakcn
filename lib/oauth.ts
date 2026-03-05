import { db } from "@/db";
import { oauthApp, oauthToken } from "@/db/schema";
import {
  OAUTH_ACCESS_TOKEN_EXPIRY_SECONDS,
  OAUTH_REFRESH_TOKEN_EXPIRY_SECONDS,
} from "@/lib/constants";
import { eq, and, isNull } from "drizzle-orm";
import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import cuid from "cuid";
import { NextRequest } from "next/server";

// --- Token generation & hashing ---

export function generateSecureToken(): string {
  return randomBytes(32).toString("hex");
}

export async function hashSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10);
}

export async function verifySecret(
  secret: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}

/** SHA-256 hash for fast token lookups (access/refresh tokens) */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// --- Scopes ---

const VALID_SCOPES = ["themes:read", "profile:read"] as const;
export type OAuthScope = (typeof VALID_SCOPES)[number];

export function validateScopes(scopes: string[]): scopes is OAuthScope[] {
  return scopes.every((s) => VALID_SCOPES.includes(s as OAuthScope));
}

export function parseScopes(scopeString: string): string[] {
  return scopeString
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- Redirect URI validation ---

export function validateRedirectUri(
  uri: string,
  registeredUris: string[]
): boolean {
  return registeredUris.includes(uri);
}

// --- PKCE ---

export function verifyCodeChallenge(
  codeVerifier: string,
  codeChallenge: string,
  method: string
): boolean {
  if (method === "S256") {
    const hash = createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    return hash === codeChallenge;
  }
  if (method === "plain") {
    return codeVerifier === codeChallenge;
  }
  return false;
}

// --- Token creation ---

export async function createTokenPair(
  appId: string,
  userId: string,
  scopes: string[]
) {
  const accessToken = generateSecureToken();
  const refreshToken = generateSecureToken();
  const now = new Date();

  const accessTokenExpiresAt = new Date(
    now.getTime() + OAUTH_ACCESS_TOKEN_EXPIRY_SECONDS * 1000
  );
  const refreshTokenExpiresAt = new Date(
    now.getTime() + OAUTH_REFRESH_TOKEN_EXPIRY_SECONDS * 1000
  );

  await db.insert(oauthToken).values({
    id: cuid(),
    accessTokenHash: hashToken(accessToken),
    refreshTokenHash: hashToken(refreshToken),
    appId,
    userId,
    scopes,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    createdAt: now,
    updatedAt: now,
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer" as const,
    expires_in: OAUTH_ACCESS_TOKEN_EXPIRY_SECONDS,
    scope: scopes.join(" "),
  };
}

// --- Bearer token resolution ---

export async function resolveUserFromBearerToken(
  authHeader: string | null
): Promise<{ userId: string; scopes: string[] } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const tokenHash = hashToken(token);

  const [record] = await db
    .select({
      userId: oauthToken.userId,
      scopes: oauthToken.scopes,
      accessTokenExpiresAt: oauthToken.accessTokenExpiresAt,
    })
    .from(oauthToken)
    .where(
      and(eq(oauthToken.accessTokenHash, tokenHash), isNull(oauthToken.revokedAt))
    )
    .limit(1);

  if (!record) return null;
  if (new Date() > record.accessTokenExpiresAt) return null;

  return { userId: record.userId, scopes: record.scopes };
}

export function requireScope(scopes: string[], required: OAuthScope): boolean {
  return scopes.includes(required);
}

export async function requireAuth(
  req: NextRequest,
  scope: OAuthScope
): Promise<
  | { tokenData: { userId: string; scopes: string[] }; error: null }
  | { tokenData: null; error: Response }
> {
  const tokenData = await resolveUserFromBearerToken(
    req.headers.get("authorization")
  );

  if (!tokenData) {
    return {
      tokenData: null,
      error: oauthError("invalid_token", "Invalid or expired access token", 401),
    };
  }

  if (!requireScope(tokenData.scopes, scope)) {
    return {
      tokenData: null,
      error: oauthError("insufficient_scope", `Requires ${scope} scope`, 403),
    };
  }

  return { tokenData, error: null };
}

// --- Client authentication ---

export async function authenticateClient(
  clientId: string,
  clientSecret: string
) {
  const [app] = await db
    .select({
      id: oauthApp.id,
      clientSecretHash: oauthApp.clientSecretHash,
    })
    .from(oauthApp)
    .where(and(eq(oauthApp.clientId, clientId), eq(oauthApp.isActive, true)))
    .limit(1);

  if (!app) return null;

  const valid = await verifySecret(clientSecret, app.clientSecretHash);
  if (!valid) return null;

  return app;
}

// --- JSON error responses ---

export function oauthError(
  error: string,
  description: string,
  status: number = 400
) {
  return Response.json({ error, error_description: description }, { status });
}
