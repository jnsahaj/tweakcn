import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { useGetProDialogStore } from "@/store/get-pro-dialog-store";
import { PostLoginActionType } from "./use-post-login-action";
import { useSubscription } from "./use-subscription";

export function useGuards() {
  const { checkValidSession } = useSessionGuard();
  const { checkValidSubscription, checkValidProSubscription } = useSubscriptionGuard();

  return {
    checkValidSession,
    checkValidSubscription,
    checkValidProSubscription,
  };
}

export function useSessionGuard() {
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  const checkValidSession = (
    mode: "signin" | "signup" = "signin",
    postLoginActionType?: PostLoginActionType,
    postLoginActionData?: any
  ) => {
    if (!session) {
      openAuthDialog(mode, postLoginActionType, postLoginActionData);
      return false;
    }

    return true;
  };

  return {
    checkValidSession,
  };
}

export function useSubscriptionGuard() {
  const { subscriptionStatus, isPending } = useSubscription();
  const { openGetProDialog } = useGetProDialogStore();

  const checkValidSubscription = () => {
    if (isPending) return false;

    if (!subscriptionStatus) return false;

    const { isSubscribed, requestsRemaining } = subscriptionStatus;

    if (isSubscribed) return true;

    if (requestsRemaining <= 0) {
      openGetProDialog();
      return false;
    }

    return true; // Allow if not subscribed but still has requests left
  };

  // Use this guard for features that are Pro only, not including free pro usage
  const checkValidProSubscription = () => {
    if (isPending) return false;

    if (!subscriptionStatus) return false;

    const { isSubscribed } = subscriptionStatus;

    if (isSubscribed) return true;

    openGetProDialog();
    return false;
  };

  return {
    checkValidSubscription,
    checkValidProSubscription,
  };
}
