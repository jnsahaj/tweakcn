import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const { isSubscribed, requestsRemaining } = await validateSubscriptionAndUsage(userId);
    return NextResponse.json({ isSubscribed, requestsRemaining });
  } catch (error) {
    logError(error as Error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
