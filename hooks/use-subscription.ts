import { authClient } from "@/lib/auth-client";
import { SubscriptionStatus } from "@/types/subscription";
import { useQuery } from "@tanstack/react-query";

async function fetchSubscriptionStatus(): Promise<SubscriptionStatus> {
  const res = await fetch("/api/subscription", { method: "GET" });
  return res.json();
}

export const SUBSCRIPTION_STATUS_QUERY_KEY = "subscriptionStatus";

export function useSubscription() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user.id;

  const { data: subscriptionStatus, ...query } = useQuery({
    queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY],
    queryFn: fetchSubscriptionStatus,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return { subscriptionStatus, ...query };
}
