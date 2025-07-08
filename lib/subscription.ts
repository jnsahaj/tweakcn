import "server-only";

import { getMyAllTimeRequestCount } from "@/actions/ai-usage";
import { polar } from "@/lib/polar";
import { SubscriptionRequiredError } from "@/types/errors";
import { SubscriptionCheck } from "@/types/subscription";
import { NextRequest } from "next/server";
import { AI_REQUEST_FREE_TIER_LIMIT } from "./constants";
import { getCurrentUserId } from "./shared";

export async function validateSubscriptionAndUsage(userId: string): Promise<SubscriptionCheck> {
  try {
    const [customer, requestsUsed] = await Promise.all([
      polar.customers
        .getStateExternal({
          externalId: userId,
        })
        // user might not be a customer yet
        .catch(() => null),
      getMyAllTimeRequestCount(userId),
    ]);

    const isSubscribed = !!customer?.activeSubscriptions?.find(
      (s) =>
        s.status === "active" && s.productId === process.env.NEXT_PUBLIC_TWEAKCN_PLUS_PRODUCT_ID
    );

    if (isSubscribed) {
      return {
        canProceed: true,
        isSubscribed: true,
        requestsUsed,
        requestsRemaining: Infinity, // Unlimited for subscribers
      };
    }

    const requestsRemaining = Math.max(0, AI_REQUEST_FREE_TIER_LIMIT - requestsUsed);
    const canProceed = requestsUsed < AI_REQUEST_FREE_TIER_LIMIT;

    if (!canProceed) {
      return {
        canProceed: false,
        isSubscribed: false,
        requestsUsed,
        requestsRemaining: 0,
        error: `You've reached your free limit of ${AI_REQUEST_FREE_TIER_LIMIT} requests. Please upgrade to continue.`,
      };
    }

    return {
      canProceed: true,
      isSubscribed: false,
      requestsUsed,
      requestsRemaining,
    };
  } catch (error) {
    console.error("Error validating subscription:", error);
    throw error;
  }
}

export async function requireSubscriptionOrFreeUsage(req: NextRequest): Promise<void> {
  const userId = await getCurrentUserId(req);
  const validation = await validateSubscriptionAndUsage(userId);

  if (!validation.canProceed) {
    throw new SubscriptionRequiredError(validation.error, {
      requestsRemaining: validation.requestsRemaining,
    });
  }
}
