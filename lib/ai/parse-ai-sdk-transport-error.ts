import { MyErrorResponseSchema, type ApiErrorCode } from "@/types/errors";

// This utility is specific to the Vercel AI SDK DefaultChatTransport behavior, where on
// non-2xx responses it throws an Error whose `message` is set to the raw `response.text()`.
// That means JSON payloads end up as stringified JSON in `error.message`.
//
// Use this to parse and normalize those errors in a typesafe way.

export type ParsedAiSdkTransportError = {
  code?: ApiErrorCode;
  message: string;
  status?: number;
  data?: unknown;
};

const KNOWN_CODES: ReadonlyArray<ApiErrorCode> = [
  "SUBSCRIPTION_REQUIRED",
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "UNKNOWN_ERROR",
];

function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === "string" && (KNOWN_CODES as ReadonlyArray<string>).includes(value);
}

export function parseAiSdkTransportError(
  error: unknown,
  fallbackMessage = "An unexpected error occurred."
): ParsedAiSdkTransportError {
  const defaultResult: ParsedAiSdkTransportError = { message: fallbackMessage };

  if (error instanceof Error) {
    const raw = error.message;
    try {
      const parsed = MyErrorResponseSchema.parse(JSON.parse(raw));
      return {
        code: isApiErrorCode(parsed.code) ? parsed.code : undefined,
        message: parsed.message ?? fallbackMessage,
        status: parsed.status,
        data: parsed.data,
      };
    } catch {
      return { message: raw || fallbackMessage };
    }
  }

  if (typeof error === "string") {
    try {
      const parsed = MyErrorResponseSchema.parse(JSON.parse(error));
      return {
        code: isApiErrorCode(parsed.code) ? parsed.code : undefined,
        message: parsed.message ?? fallbackMessage,
        status: parsed.status,
        data: parsed.data,
      };
    } catch {
      return { message: error };
    }
  }

  return defaultResult;
}
