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

export class ThemeLimitError extends Error {
  constructor(message = "Theme limit reached") {
    super(message);
    this.name = "ThemeLimitError";
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
