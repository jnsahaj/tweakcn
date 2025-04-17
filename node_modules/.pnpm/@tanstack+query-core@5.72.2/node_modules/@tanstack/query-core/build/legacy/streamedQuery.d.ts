import { A as QueryKey, X as QueryFunctionContext, P as QueryFunction } from './hydration-p5rrYdPC.js';
import './removable.js';
import './subscribable.js';

/**
 * This is a helper function to create a query function that streams data from an AsyncIterable.
 * Data will be an Array of all the chunks received.
 * The query will be in a 'pending' state until the first chunk of data is received, but will go to 'success' after that.
 * The query will stay in fetchStatus 'fetching' until the stream ends.
 * @param queryFn - The function that returns an AsyncIterable to stream data from.
 * @param refetchMode - Defaults to 'reset', which replaces data when a refetch happens. Set to 'append' to append new data to the existing data.
 */
declare function streamedQuery<TQueryFnData = unknown, TQueryKey extends QueryKey = QueryKey>({ queryFn, refetchMode, }: {
    queryFn: (context: QueryFunctionContext<TQueryKey>) => AsyncIterable<TQueryFnData> | Promise<AsyncIterable<TQueryFnData>>;
    refetchMode?: 'append' | 'reset';
}): QueryFunction<Array<TQueryFnData>, TQueryKey>;

export { streamedQuery };
