"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";

export function AlertBanner() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user.id;

  const fetchSubscriptionStatus = async () => {
    const res = await fetch("/api/subscription", { method: "GET" });
    return res.json();
  };

  const { data: subscriptionStatus = null } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Ensure fresh data when manually updated
    refetchOnWindowFocus: false,
  });

  const isPro = subscriptionStatus?.isSubscribed ?? false;
  const freeProMessagesLeft = subscriptionStatus?.requestsRemaining ?? 0;

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!subscriptionStatus) {
      setShowBanner(false);
      return;
    }

    const { isSubscribed, requestsRemaining } = subscriptionStatus;
    const shouldShowBanner =
      isLoggedIn && !isSubscribed && requestsRemaining <= AI_REQUEST_FREE_TIER_LIMIT;

    if (shouldShowBanner) {
      // Reset the banner state when subscription status changes
      setShowBanner(false);
      timer = setTimeout(() => setShowBanner(true), 100);
    } else {
      setShowBanner(false);
    }

    return () => clearTimeout(timer);
  }, [isLoggedIn, subscriptionStatus]);

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

  if (isPro) return null;

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
          <div className="bg-muted text-muted-foreground flex items-center justify-between gap-2 rounded-t-lg px-3 py-1 text-xs">
            <p
              className={cn(
                "text-pretty @2xl/alert-banner:py-1.5 @2xl/alert-banner:text-sm",
                showBanner ? "opacity-100" : "opacity-0"
              )}
            >
              {getBannerContent()}
            </p>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="link" size="sm" className="h-fit">
                Upgrade
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="size-5 [&>svg]:size-3"
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
