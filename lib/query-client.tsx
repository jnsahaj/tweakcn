"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";
import posthog from "posthog-js";

function logClientError(error: Error, context: Record<string, unknown>) {
  console.error("Query error:", error, context);

  if (error.name !== "UnauthorizedError" && error.name !== "ValidationError") {
    try {
      posthog.capture("query_error", {
        error: error.message,
        errorName: error.name,
        stack: error.stack,
        ...context,
      });
    } catch (posthogError) {
      console.error("Failed to log to PostHog:", posthogError);
    }
  }
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        retry: (failureCount, error: Error) => {
          // Don't retry on authentication or validation errors
          if (error?.name === "UnauthorizedError" || error?.name === "ValidationError") {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: (failureCount, error: Error) => {
          // Don't retry mutations on client errors (4xx)
          if (error?.name === "UnauthorizedError" || error?.name === "ValidationError") {
            return false;
          }
          // Only retry once for server errors (5xx)
          return failureCount < 1;
        },
        onError: (error: Error, variables: unknown, context: unknown) => {
          logClientError(error, {
            type: "mutation",
            variables: JSON.stringify(variables),
            context,
          });
        },
      },
    },
  });
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}
