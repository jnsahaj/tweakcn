// Utility functions and types for server-side and client-side pagination abstraction

export interface PaginatedResponse<T> {
  data: T[];
  /** Cursor to fetch the next page. `null` means there are no more pages. */
  nextCursor: string | null;
}

/**
 * Build a {@link PaginatedResponse} from the fetched records.
 *
 * The function assumes that the array is already sorted according to the
 * desired ordering and that every record has a stable `id` field that can be
 * reused as a cursor.
 */
export function buildPaginatedResponse<T extends { id: string }>(
  items: T[],
  limit: number
): PaginatedResponse<T> {
  const nextCursor = items.length === limit ? items[items.length - 1].id : null;
  return { data: items, nextCursor };
}
