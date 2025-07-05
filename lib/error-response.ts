import { ValidationError, SubscriptionRequiredError, UnauthorizedError } from "@/types/errors";
import { logError } from "./shared";

function jsonError(code: string, message: string, data: unknown, status: number) {
  return new Response(JSON.stringify({ code, message, data }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function handleError(error: unknown, context: Record<string, unknown> = {}): Response {
  if (error instanceof ValidationError) {
    return jsonError("VALIDATION_ERROR", error.message, { details: error.details }, 400);
  }

  if (error instanceof SubscriptionRequiredError) {
    return jsonError("SUBSCRIPTION_REQUIRED", error.message, error.data, 402);
  }

  if (error instanceof UnauthorizedError) {
    return jsonError("UNAUTHORIZED", error.message, undefined, 401);
  }

  logError(error as Error, context);
  return new Response("Internal Server Error", { status: 500 });
}
