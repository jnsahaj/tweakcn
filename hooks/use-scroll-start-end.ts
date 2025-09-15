import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Observes two sentinel elements (start/end) inside a scrollable container
 * and reports whether the scroll position is at the start or at the end.
 *
 * Props:
 * - (optional) containerRef: Ref to the scroll container element to be used as the observer root.
 *   When provided, it takes precedence over observerOptions.root.
 * - (optional) observerOptions: Standard IntersectionObserver options. If no containerRef is provided,
 *   you may provide observerOptions.root (an Element) or omit it to default to the viewport.
 *
 * Root precedence: containerRef.current -> observerOptions.root -> null (viewport).
 *
 * Returns:
 * - isScrollStart: boolean indicating the start sentinel is visible in the root
 * - isScrollEnd: boolean indicating the end sentinel is visible in the root
 * - scrollStartRef, scrollEndRef: attach inside the scrollable content near the start/end edges
 */

type IntersectionObserverInitWithoutRoot = Omit<IntersectionObserverInit, "root"> & {
  root?: never;
};

type UseScrollStartEndProps =
  | {
      containerRef: React.RefObject<HTMLDivElement | null> | null;
      observerOptions?: IntersectionObserverInitWithoutRoot;
    }
  | {
      containerRef?: null | undefined;
      observerOptions?: IntersectionObserverInit;
    };

const defaultObserverOptions: IntersectionObserverInit = {
  root: null,
  threshold: 0,
  rootMargin: "0px",
};

export function useScrollStartEnd({
  containerRef = null,
  observerOptions = defaultObserverOptions,
}: UseScrollStartEndProps = {}) {
  const [isScrollStart, setIsScrollStart] = useState(false);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const scrollStartRef = useRef<HTMLDivElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const intersectionObserverOptions = useMemo<IntersectionObserverInit>(() => {
    return {
      ...defaultObserverOptions,
      ...observerOptions,
      root: containerRef?.current ?? observerOptions.root ?? null,
    };
  }, [observerOptions.root, observerOptions.threshold, observerOptions.rootMargin]);

  useEffect(() => {
    const startMarker = scrollStartRef.current;
    const endMarker = scrollEndRef.current;
    if (!startMarker || !endMarker) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === startMarker) setIsScrollStart(entry.isIntersecting);
        if (entry.target === endMarker) setIsScrollEnd(entry.isIntersecting);
      }
    }, intersectionObserverOptions);

    observer.observe(startMarker);
    observer.observe(endMarker);

    return () => observer.disconnect();
  }, [intersectionObserverOptions]);

  return { isScrollStart, isScrollEnd, scrollStartRef, scrollEndRef };
}
