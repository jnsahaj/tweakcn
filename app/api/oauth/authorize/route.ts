import { db } from "@/db";
import { oauthApp, oauthAuthorizationCode } from "@/db/schema";
import { OAUTH_AUTHORIZATION_CODE_EXPIRY_SECONDS } from "@/lib/constants";
import {
  generateSecureToken,
  oauthError,
  parseScopes,
  validateRedirectUri,
  validateScopes,
} from "@/lib/oauth";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import cuid from "cuid";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const clientId = params.get("client_id");
  const redirectUri = params.get("redirect_uri");
  const responseType = params.get("response_type");
  const scopeParam = params.get("scope");
  const state = params.get("state");
  const codeChallenge = params.get("code_challenge");
  const codeChallengeMethod = params.get("code_challenge_method") ?? "S256";

  // Validate required params
  if (!clientId || !redirectUri || !responseType || !scopeParam) {
    return oauthError(
      "invalid_request",
      "Missing required parameters: client_id, redirect_uri, response_type, scope"
    );
  }

  if (responseType !== "code") {
    return oauthError(
      "unsupported_response_type",
      "Only response_type=code is supported"
    );
  }

  // Look up OAuth app
  const [app] = await db
    .select({ id: oauthApp.id, redirectUris: oauthApp.redirectUris })
    .from(oauthApp)
    .where(and(eq(oauthApp.clientId, clientId), eq(oauthApp.isActive, true)))
    .limit(1);

  if (!app) {
    return oauthError("invalid_client", "Unknown client_id");
  }

  // Validate redirect URI
  if (!validateRedirectUri(redirectUri, app.redirectUris)) {
    return oauthError("invalid_request", "redirect_uri not registered");
  }

  // Validate scopes
  const scopes = parseScopes(scopeParam);
  if (!validateScopes(scopes)) {
    return oauthError("invalid_scope", "Invalid or unsupported scope");
  }

  // Check that the user is logged in
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    // Redirect to the OAuth authorize page which handles sign-in
    const pageUrl = new URL("/oauth/authorize", req.nextUrl.origin);
    req.nextUrl.searchParams.forEach((value, key) => {
      pageUrl.searchParams.set(key, value);
    });
    return Response.redirect(pageUrl.toString(), 302);
  }

  // Generate authorization code
  const code = generateSecureToken();
  const now = new Date();

  await db.insert(oauthAuthorizationCode).values({
    id: cuid(),
    code,
    appId: app.id,
    userId: session.user.id,
    scopes,
    redirectUri,
    codeChallenge: codeChallenge ?? null,
    codeChallengeMethod: codeChallenge ? codeChallengeMethod : null,
    expiresAt: new Date(
      now.getTime() + OAUTH_AUTHORIZATION_CODE_EXPIRY_SECONDS * 1000
    ),
    createdAt: now,
  });

  // Redirect back to the app with the code
  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set("code", code);
  if (state) redirectUrl.searchParams.set("state", state);

  return Response.redirect(redirectUrl.toString(), 302);
}
