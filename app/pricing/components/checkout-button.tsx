"use client";

import { createCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Loader } from "lucide-react";
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

  const { subscriptionStatus } = useSubscription();

  const handleOpenCheckout = async () => {
    if (!session) {
      openAuthDialog("signup", "CHECKOUT");
      return;
    }

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
      disabled={isPending || disabled}
      className={cn("", className)}
      {...props}
      onClick={handleOpenCheckout}
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <Loader className="size-4 animate-spin" />
          Redirecting to Checkout
        </div>
      ) : (
        "Upgrade to Pro"
      )}
    </Button>
  );
}
