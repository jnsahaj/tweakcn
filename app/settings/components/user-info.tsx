"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { Gem } from "lucide-react";

export function UserInfo() {
  const { data: session } = authClient.useSession();
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus?.isSubscribed ?? false;

  return (
    <div className="flex flex-col space-y-0.5">
      <p className="text-sm leading-tight font-medium">
        {session?.user.name}{" "}
        {isPro && (
          <span className="bg-accent text-accent-foreground inline-flex w-fit items-center gap-1 rounded-md px-1 py-0.5 text-xs leading-tight font-medium">
            <Gem className="size-2.5" /> Pro
          </span>
        )}
      </p>
      <p className="text-muted-foreground text-xs leading-tight">{session?.user.email}</p>
    </div>
  );
}
