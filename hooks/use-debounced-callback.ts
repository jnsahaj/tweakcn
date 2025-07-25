import { useRef, useEffect, useCallback } from "react";

export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  wait: number
) {
  // Use a ref to store the latest callback.
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Use a ref to store the timeout ID
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  useEffect(() => {
    // Clear the timeout when the component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [wait]); // Rerun effect only if wait time changes

  // The debounced function
  const debouncedCallback = useCallback(
    (...args: A) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, wait);
    },
    [wait] // Dependency is only the wait time
  );

  return debouncedCallback;
}
