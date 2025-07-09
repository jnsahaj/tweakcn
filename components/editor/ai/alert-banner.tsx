"use client";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AlertBanner() {
  const [showBanner, setShowBanner] = useState(false);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user.id;
  const { subscriptionStatus, isPending } = useSubscription();

  const isPro = subscriptionStatus?.isSubscribed ?? false;
  const freeProMessagesLeft = subscriptionStatus?.requestsRemaining ?? 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const shouldShowBanner =
      isLoggedIn && !isPro && freeProMessagesLeft <= AI_REQUEST_FREE_TIER_LIMIT;

    if (shouldShowBanner) {
      if (showBanner) return;

      timer = setTimeout(() => setShowBanner(true), 1000);
    } else {
      setShowBanner(false);
    }

    return () => clearTimeout(timer);
  }, [isLoggedIn, isPro, freeProMessagesLeft]);

  const getBannerContent = () => {
    if (isLoggedIn && !isPro && freeProMessagesLeft > 0) {
      return (
        <span>
          You have {freeProMessagesLeft} Free
          <span className="text-primary font-medium">{` Pro `}</span>
          messages left.
        </span>
      );
    }

    if (isLoggedIn && !isPro && freeProMessagesLeft <= 0) {
      return (
        <span>
          Upgrade to <span className="text-primary font-medium">Pro</span> to unlock unlimited
          requests.
        </span>
      );
    }
  };

  if (isPro || isPending) return null;

  return (
    <div className="@container/alert-banner relative">
      {showBanner && <div className="bg-muted absolute inset-0 translate-y-full" />}

      <div
        className={cn(
          "relative grid content-end transition-all duration-300 ease-in-out",
          showBanner ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="bg-muted text-muted-foreground flex items-center justify-between gap-2 rounded-t-lg px-3 py-1.5 text-xs">
            <p
              className={cn(
                "text-pretty @2xl/alert-banner:text-sm",
                showBanner ? "opacity-100" : "opacity-0"
              )}
            >
              {getBannerContent()}
            </p>
            <div className="ml-auto flex items-center gap-1">
              <Link href="/pricing">
                <Button variant="link" size="sm" className="h-fit @2xl/alert-banner:text-sm">
                  Upgrade
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="size-4 [&>svg]:size-3"
                onClick={() => setShowBanner(false)}
              >
                <X />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
