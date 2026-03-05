"use client";

import Github from "@/assets/github.svg";
import Google from "@/assets/google.svg";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SCOPE_LABELS: Record<string, string> = {
  "themes:read": "Read your saved themes",
  "profile:read": "Read your profile (name, email)",
};

export default function OAuthAuthorizePage() {
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appName, setAppName] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const clientId = searchParams.get("client_id");
  const scopes =
    searchParams
      .get("scope")
      ?.split(/[\s,]+/)
      .filter(Boolean) ?? [];

  useEffect(() => {
    if (!clientId) {
      setError("Missing client_id parameter");
      return;
    }

    fetch(`/api/oauth/app-info?client_id=${encodeURIComponent(clientId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error_description ?? "Invalid application");
        } else {
          setAppName(data.name);
        }
      })
      .catch(() => setError("Failed to validate application"));
  }, [clientId]);

  useEffect(() => {
    if (!session || redirecting || error) return;

    setRedirecting(true);
    const apiUrl = `/api/oauth/authorize?${searchParams.toString()}`;
    window.location.href = apiUrl;
  }, [session, searchParams, redirecting, error]);

  const callbackURL = `/oauth/authorize?${searchParams.toString()}`;

  const handleSignIn = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL });
    } catch {
      setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null;

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (isPending || redirecting || !appName) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm text-muted-foreground">Sign in to</p>
          <h1 className="mt-1 text-lg font-semibold text-foreground">
            {appName}
          </h1>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => handleSignIn("google")}
            className="h-10 w-full justify-center gap-2"
            disabled={isLoading}
          >
            <Google className="h-4 w-4" />
            Continue with Google
            {loadingProvider === "google" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSignIn("github")}
            className="h-10 w-full justify-center gap-2"
            disabled={isLoading}
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
            {loadingProvider === "github" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          </Button>
        </div>

        {scopes.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Permissions requested
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {scopes.map((scope) => (
                <li key={scope}>{SCOPE_LABELS[scope] ?? scope}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Authorizing will grant {appName} access to the permissions above.
        </p>
      </div>
    </div>
  );
}
