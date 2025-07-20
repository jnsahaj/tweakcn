"use client";

import { createCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { SUBSCRIPTION_STATUS_QUERY_KEY, useSubscription } from "@/hooks/use-subscription";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { Gem, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps, useTransition } from "react";

interface CheckoutButtonProps extends ComponentProps<typeof Button> {}

export function CheckoutButton({ disabled, className, ...props }: CheckoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  usePostLoginAction("CHECKOUT", () => {
    handleOpenCheckout();
  });

  const queryClient = useQueryClient();
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus?.isSubscribed ?? false;

  const handleOpenCheckout = async () => {
    if (!session) {
      openAuthDialog("signup", "CHECKOUT");
      return;
    }

    if (subscriptionStatus?.isSubscribed) {
      router.push("/settings");
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

      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY] });
      router.push(res.url);
    });
  };

  return (
    <Button
      variant={isPro ? "ghost" : "default"}
      disabled={isPending || disabled}
      className={cn(isPro ? "border" : "", className)}
      {...props}
      onClick={handleOpenCheckout}
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <Loader className="size-4 animate-spin" />
          Redirecting to Checkout
        </div>
      ) : isPro ? (
        <span className="flex items-center gap-1.5">
          <Gem />
          {`You're Subscribed to Pro`}
        </span>
      ) : (
        "Upgrade to Pro"
      )}
    </Button>
  );
}
