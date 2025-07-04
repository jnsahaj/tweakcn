import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function AlertBanner() {
  const { data: session } = authClient.useSession();
  const isPro = false;
  const isLoggedIn = !!session;
  const freeProMessagesLeft = 5;

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoggedIn && !isPro && freeProMessagesLeft <= 5) {
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
          You only have {freeProMessagesLeft} Free
          <span className="text-primary font-medium">{` Pro `}</span>
          messages left.
        </span>
      );
    }

    if (isLoggedIn && !isPro && freeProMessagesLeft <= 0) {
      return (
        <span>
          Upgrade to <span className="text-primary font-medium">Pro</span> to unlock all features
          and higher limits.
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
