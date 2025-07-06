"use client";

import { createCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function CheckoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();

  const fetchSubscriptionStatus = async () => {
    const res = await fetch("/api/subscription", { method: "GET" });
    return res.json();
  };

  const { data: subscriptionStatus = null } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: fetchSubscriptionStatus,
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 5,
  });

  const handleOpenCheckout = async () => {
    if (subscriptionStatus?.isSubscribed) {
      router.push("/dashboard");
      return;
    }

    startTransition(async () => {
      const res = await createCheckout();
      if ("error" in res || !res.url) {
        toast({
          title: "Error",
          description: res.error || "Failed to create checkout",
          variant: "destructive",
        });
        return;
      }

      router.push(res.url);
    });
  };

  return (
    <Button
      className="from-primary to-primary/75 hover:shadow-primary/25 h-12 w-full bg-gradient-to-r text-base font-medium transition-all duration-200 hover:shadow-lg"
      size="lg"
      onClick={handleOpenCheckout}
      disabled={isPending}
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          Redirecting to Checkout
        </div>
      ) : (
        "Upgrade to Pro"
      )}
    </Button>
  );
}
