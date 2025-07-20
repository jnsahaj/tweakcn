import { useState, useRef, useCallback } from "react";
import {
  InspectorState,
  areInspectorStatesEqual,
  createInspectorState,
  getEmptyInspectorState,
} from "../../lib/inspector/inspector-state-utils";

export const useInspectorState = () => {
  const [inspector, setInspector] = useState<InspectorState>(getEmptyInspectorState());
  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const lastElementRef = useRef<HTMLElement | null>(null);
  const isOverlayHiddenRef = useRef<boolean>(false);

  const updateInspectorState = useCallback((rect: DOMRect, matches: string[]) => {
    setInspector((prev: InspectorState) => {
      const newState = createInspectorState(rect, matches);

      if (areInspectorStatesEqual(prev, newState)) {
        return prev;
      }

      isOverlayHiddenRef.current = false;
      return newState;
    });
  }, []);

  const clearInspectorState = useCallback(() => {
    if (lastElementRef.current || !isOverlayHiddenRef.current) {
      lastElementRef.current = null;
      isOverlayHiddenRef.current = true;
      setInspector(getEmptyInspectorState());
    }
  }, []);

  const toggleInspector = useCallback((onToggleOff?: () => void) => {
    setInspectorEnabled((prev) => {
      if (prev) {
        lastElementRef.current = null;
        isOverlayHiddenRef.current = true;
        setInspector(getEmptyInspectorState());
        onToggleOff?.();
      } else {
        isOverlayHiddenRef.current = false;
      }
      return !prev;
    });
  }, []);

  return {
    inspector,
    inspectorEnabled,
    lastElementRef,
    isOverlayHiddenRef,
    updateInspectorState,
    clearInspectorState,
    toggleInspector,
  };
};
