import { useInfiniteQuery } from "@tanstack/react-query";
import { PaginatedResponse } from "@/utils/pagination";

export type PaginatedQueryFn<T> = (limit: number, cursor?: string) => Promise<PaginatedResponse<T>>;

/**
 * A reusable abstraction on top of React Query's `useInfiniteQuery` for cursor-
 * based pagination using a cursor/limit backend.
 *
 * Example usage:
 * ```ts
 * const query = usePaginatedQuery(userKeys.list(), (limit, cursor) =>
 *   getUsers(limit, cursor)
 * );
 * ```
 */
export function usePaginatedQuery<T>(
  queryKey: readonly unknown[],
  queryFn: PaginatedQueryFn<T>,
  limit = 10
) {
  return useInfiniteQuery<PaginatedResponse<T>, Error>({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
