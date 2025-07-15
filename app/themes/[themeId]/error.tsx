"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThemeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground mb-8">
          There was an error loading this theme. Please try again later.
        </p>
        <div className="space-x-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/settings">Return to Settings</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
