# OAuth 2.0 API

tweakcn exposes an OAuth 2.0 API so external apps can authenticate users and access their data.

## Registering an app

Register an OAuth app via the CLI script:

```bash
npx tsx scripts/create-oauth-app.ts \
  --name "My App" \
  --redirect-uris "https://myapp.com/callback" \
  --scopes "themes:read,profile:read" \
  --description "Optional description"
```

This outputs a `client_id` and `client_secret`. The secret is shown once and cannot be retrieved later.

## Authorization flow

Standard OAuth 2.0 Authorization Code flow. PKCE is supported but optional.

### 1. Redirect the user to authorize

```
GET https://tweakcn.com/api/oauth/authorize
  ?client_id=CLIENT_ID
  &redirect_uri=https://myapp.com/callback
  &response_type=code
  &scope=themes:read profile:read
  &state=RANDOM_STRING
```

If the user is not signed in, they'll be shown a sign-in page. After signing in, they're redirected to your `redirect_uri` with an authorization code:

```
https://myapp.com/callback?code=AUTH_CODE&state=RANDOM_STRING
```

### 2. Exchange the code for tokens

```bash
curl -X POST https://tweakcn.com/api/oauth/token \
  -d grant_type=authorization_code \
  -d client_id=CLIENT_ID \
  -d client_secret=CLIENT_SECRET \
  -d code=AUTH_CODE \
  -d redirect_uri=https://myapp.com/callback
```

Response:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "themes:read profile:read"
}
```

### 3. Call the API

Pass the access token as a Bearer token:

```bash
curl https://tweakcn.com/api/v1/themes \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### 4. Refresh tokens

Access tokens expire after 1 hour. Use the refresh token to get a new pair:

```bash
curl -X POST https://tweakcn.com/api/oauth/token \
  -d grant_type=refresh_token \
  -d client_id=CLIENT_ID \
  -d client_secret=CLIENT_SECRET \
  -d refresh_token=REFRESH_TOKEN
```

### 5. Revoke tokens

```bash
curl -X POST https://tweakcn.com/api/oauth/revoke \
  -d token=ACCESS_OR_REFRESH_TOKEN
```

## Using with Better Auth's genericOAuth

tweakcn works as a provider with Better Auth's `genericOAuth` plugin:

```typescript
// server
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "tweakcn",
          clientId: process.env.TWEAKCN_CLIENT_ID,
          clientSecret: process.env.TWEAKCN_CLIENT_SECRET,
          authorizationUrl: "https://tweakcn.com/api/oauth/authorize",
          tokenUrl: "https://tweakcn.com/api/oauth/token",
          userInfoUrl: "https://tweakcn.com/api/oauth/userinfo",
          scopes: ["themes:read", "profile:read"],
        },
      ],
    }),
  ],
});
```

```typescript
// client
import { genericOAuthClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});

await authClient.signIn.oauth2({
  providerId: "tweakcn",
  callbackURL: "/dashboard",
});
```

## API endpoints

All endpoints require `Authorization: Bearer <access_token>`.

### `GET /api/oauth/userinfo`

OIDC-compatible userinfo endpoint. Returns flat user fields. Requires `profile:read` scope.

```json
{
  "sub": "user_123",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "picture": "https://..."
}
```

### `GET /api/v1/me`

Returns the authenticated user's profile. Requires `profile:read` scope.

```json
{
  "data": {
    "id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "image": "https://..."
  }
}
```

### `GET /api/v1/themes`

Returns all themes owned by the authenticated user. Requires `themes:read` scope.

```json
{
  "data": [
    {
      "id": "...",
      "name": "My Theme",
      "styles": { ... },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### `GET /api/v1/themes/:themeId`

Returns a single theme by ID. Only returns themes owned by the authenticated user. Requires `themes:read` scope.

## Scopes

| Scope | Description |
|-------|-------------|
| `themes:read` | Read the user's saved themes |
| `profile:read` | Read the user's profile (name, email, avatar) |

## PKCE support

For public clients (e.g. SPAs, mobile apps), use PKCE by adding `code_challenge` and `code_challenge_method=S256` to the authorize request, then `code_verifier` when exchanging the code.

## Error responses

All error responses follow the OAuth 2.0 spec:

```json
{
  "error": "invalid_token",
  "error_description": "Invalid or expired access token"
}
```
