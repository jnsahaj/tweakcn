import { DefaultError, QueryKey, FetchQueryOptions, QueryClient } from '@tanstack/query-core';

declare function usePrefetchQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>, queryClient?: QueryClient): void;

export { usePrefetchQuery };
