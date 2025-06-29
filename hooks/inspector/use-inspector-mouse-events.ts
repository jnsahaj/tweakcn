import { useCallback, useEffect, MouseEvent } from "react";
import { debounce } from "../../utils/debounce";
import { findThemeClasses } from "../../lib/inspector/theme-class-finder";

interface UseInspectorMouseEventsProps {
  inspectorEnabled: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  lastElementRef: React.MutableRefObject<HTMLElement | null>;
  updateInspectorState: (rect: DOMRect, matches: string[]) => void;
  clearInspectorState: () => void;
}

export const useInspectorMouseEvents = ({
  inspectorEnabled,
  rootRef,
  lastElementRef,
  updateInspectorState,
  clearInspectorState,
}: UseInspectorMouseEventsProps) => {
  const debouncedInspectorUpdate = useCallback(
    debounce((target: HTMLElement) => {
      const rootElement = rootRef.current;
      if (!rootElement) return;

      if (!rootElement.contains(target) || target === rootElement) return;

      const result = findThemeClasses(target, rootElement);

      if (result) {
        if (lastElementRef.current === result.element) {
          return;
        }

        lastElementRef.current = result.element;
        const rect = result.element.getBoundingClientRect();
        updateInspectorState(rect, result.matches);
        return;
      }

      clearInspectorState();
    }, 20),
    [rootRef, lastElementRef, updateInspectorState, clearInspectorState]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target || !inspectorEnabled) return;

      debouncedInspectorUpdate(target);
    },
    [inspectorEnabled, debouncedInspectorUpdate]
  );

  const handleMouseLeave = useCallback(() => {
    lastElementRef.current = null;
    debouncedInspectorUpdate.cancel();
  }, [debouncedInspectorUpdate, lastElementRef]);

  useEffect(() => {
    if (!inspectorEnabled) return;

    const handleDocumentMouseMove = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) return;

      if (rootRef.current?.contains(target)) {
        return;
      }

      if (target.closest("[data-inspector-overlay]")) {
        return;
      }

      clearInspectorState();
      debouncedInspectorUpdate.cancel();
    };

    document.addEventListener("mousemove", handleDocumentMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
    };
  }, [inspectorEnabled, clearInspectorState, debouncedInspectorUpdate, rootRef]);

  useEffect(() => {
    return () => {
      debouncedInspectorUpdate.cancel();
    };
  }, [debouncedInspectorUpdate]);

  return {
    debouncedInspectorUpdate,
    handleMouseMove,
    handleMouseLeave,
  };
};
