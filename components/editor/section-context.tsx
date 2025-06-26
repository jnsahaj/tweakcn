import { createContext } from "react";

interface SectionContextType {
  /** Whether the parent ControlSection is currently expanded */
  isExpanded: boolean;
  /** Set the expanded state explicitly */
  setIsExpanded: (expanded: boolean) => void;
  /** Helper to toggle the expanded state */
  toggleExpanded: () => void;
}

/**
 * Context that allows descendants of a ControlSection to query or mutate
 * the expanded / collapsed state of their parent section.
 */
export const SectionContext = createContext<SectionContextType | undefined>(undefined);
