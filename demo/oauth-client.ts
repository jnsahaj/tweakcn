/**
 * Demo OAuth client for tweakcn API.
 *
 * Usage:
 *   1. Register the app:  npx tsx scripts/create-oauth-app.ts --name "Demo App" --redirect-uris "http://localhost:4000/callback"
 *   2. Set env vars:      export TWEAKCN_CLIENT_ID=... TWEAKCN_CLIENT_SECRET=...
 *   3. Run:               npx tsx demo/oauth-client.ts
 *   4. Open:              http://localhost:4000
 */

import http from "http";
import { URL } from "url";

const PORT = 4001;
const TWEAKCN_BASE = process.env.TWEAKCN_BASE_URL ?? "http://localhost:3000";
const CLIENT_ID = process.env.TWEAKCN_CLIENT_ID;
const CLIENT_SECRET = process.env.TWEAKCN_CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Missing TWEAKCN_CLIENT_ID or TWEAKCN_CLIENT_SECRET env vars.\n" +
      "Run the registration script first:\n" +
      '  npx tsx scripts/create-oauth-app.ts --name "Demo App" --redirect-uris "http://localhost:4000/callback"\n' +
      "Then export TWEAKCN_CLIENT_ID and TWEAKCN_CLIENT_SECRET."
  );
  process.exit(1);
}

// In-memory token storage (demo only)
let tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
} | null = null;

function html(body: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>tweakcn OAuth Demo</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #0a0a0a; color: #e5e5e5; }
    a { color: #60a5fa; }
    pre { background: #1a1a2e; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 14px; }
    .btn { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .btn:hover { background: #2563eb; }
    h1 { color: #f5f5f5; }
    h2 { color: #d4d4d4; margin-top: 32px; }
    .token-info { background: #1a2e1a; padding: 12px; border-radius: 8px; margin: 8px 0; }
    hr { border: none; border-top: 1px solid #333; margin: 24px 0; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

async function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  // Home page
  if (url.pathname === "/") {
    const authorizeUrl = new URL(`${TWEAKCN_BASE}/api/oauth/authorize`);
    authorizeUrl.searchParams.set("client_id", CLIENT_ID!);
    authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "themes:read profile:read");
    authorizeUrl.searchParams.set(
      "state",
      Math.random().toString(36).slice(2)
    );

    let body = `<h1>tweakcn OAuth Demo</h1>`;

    if (tokens) {
      body += `
        <div class="token-info">Authenticated! Access token expires in ${tokens.expires_in}s</div>
        <p><a href="/profile" class="btn">View Profile</a> &nbsp; <a href="/themes" class="btn">View Themes</a> &nbsp; <a href="/logout" class="btn" style="background:#ef4444">Logout</a></p>
      `;
    } else {
      body += `
        <p>This demo app authenticates with tweakcn using OAuth 2.0 and fetches your themes.</p>
        <p><a href="${authorizeUrl.toString()}" class="btn">Login with tweakcn</a></p>
      `;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html(body));
    return;
  }

  // OAuth callback
  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        html(
          `<h1>Authorization Failed</h1><pre>${error}: ${url.searchParams.get("error_description")}</pre><p><a href="/">Try again</a></p>`
        )
      );
      return;
    }

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(html(`<h1>Missing authorization code</h1>`));
      return;
    }

    // Exchange code for tokens
    const tokenRes = await fetch(`${TWEAKCN_BASE}/api/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        html(
          `<h1>Token Exchange Failed</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre><p><a href="/">Try again</a></p>`
        )
      );
      return;
    }

    tokens = tokenData;
    console.log("Tokens received:", {
      scope: tokenData.scope,
      expires_in: tokenData.expires_in,
    });

    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  // Profile page
  if (url.pathname === "/profile") {
    if (!tokens) {
      res.writeHead(302, { Location: "/" });
      res.end();
      return;
    }

    const apiRes = await fetch(`${TWEAKCN_BASE}/api/v1/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const data = await apiRes.json();

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      html(
        `<h1>Your Profile</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <p><a href="/">Back</a></p>`
      )
    );
    return;
  }

  // Themes page
  if (url.pathname === "/themes") {
    if (!tokens) {
      res.writeHead(302, { Location: "/" });
      res.end();
      return;
    }

    const apiRes = await fetch(`${TWEAKCN_BASE}/api/v1/themes`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const data = await apiRes.json();

    let themesHtml = `<h1>Your Themes</h1>`;
    if (data.data && Array.isArray(data.data)) {
      themesHtml += `<p>${data.data.length} theme(s) found</p>`;
      for (const theme of data.data) {
        themesHtml += `
          <hr>
          <h2>${theme.name}</h2>
          <pre>${JSON.stringify(theme.styles, null, 2)}</pre>
        `;
      }
    } else {
      themesHtml += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
    themesHtml += `<p><a href="/">Back</a></p>`;

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html(themesHtml));
    return;
  }

  // Logout
  if (url.pathname === "/logout") {
    if (tokens) {
      // Revoke the token
      await fetch(`${TWEAKCN_BASE}/api/oauth/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token: tokens.access_token }),
      });
      tokens = null;
    }
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  res.writeHead(404);
  res.end("Not found");
}

const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`\ntweekcn OAuth Demo Client running at http://localhost:${PORT}`);
  console.log(`tweakcn base URL: ${TWEAKCN_BASE}\n`);
});
