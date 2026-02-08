import z from "zod";

// Error codes for server actions - these survive serialization
export const ErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  THEME_NOT_FOUND: "THEME_NOT_FOUND",
  THEME_LIMIT_REACHED: "THEME_LIMIT_REACHED",
  ALREADY_PUBLISHED: "ALREADY_PUBLISHED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// Typed result for server actions
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: ErrorCode; message: string } };

// Helper to create error results
export function actionError(code: ErrorCode, message: string): ActionResult<never> {
  return { success: false, error: { code, message } };
}

// Helper to create success results
export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class SubscriptionRequiredError extends Error {
  constructor(
    message = "Subscription required",
    public data?: unknown
  ) {
    super(message);
    this.name = "SubscriptionRequiredError";
  }
}

export class ThemeNotFoundError extends Error {
  constructor(message = "Theme not found") {
    super(message);
    this.name = "ThemeNotFoundError";
  }
}

export type ApiErrorCode =
  | "SUBSCRIPTION_REQUIRED"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "UNKNOWN_ERROR";

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public data?: unknown,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const MyErrorResponseSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  status: z.number().optional(),
});

export type MyErrorResponseType = z.infer<typeof MyErrorResponseSchema>;
