import { useState, useEffect, useCallback } from "react";
import { getContrastRatio } from "../utils/contrast-checker";
import { debounce } from "../utils/debounce";

type ColorPair = {
  id: string;
  foreground: string;
  background: string;
  label: string;
};

/**
 * Hook that checks if the contrast between two colors meets accessibility standards
 * @param foregroundColor - Text color or foreground element color
 * @param backgroundColor - Background color
 * @returns Object with contrast information and whether it meets WCAG AA requirements
 */
export function useContrastChecker(colorPairs: ColorPair[]) {
  const [contrastResults, setContrastResults] = useState<
    Array<{
      id: string;
      contrastRatio: number;
      isValid: boolean;
      label: string;
    }>
  >([]);
  const [failingPairs, setFailingPairs] = useState<string[]>([]);
  const minimumRequiredRatio = 4.5; // WCAG AA standard for normal text

  const debouncedCalculation = useCallback(
    debounce((pairs: ColorPair[]) => {
      if (!pairs.length) {
        setContrastResults([]);
        setFailingPairs([]);
        return;
      }

      try {
        const results = pairs.map((pair) => {
          const ratio = parseFloat(
            getContrastRatio(pair.foreground, pair.background)
          );
          return {
            id: pair.id,
            contrastRatio: ratio,
            isValid: ratio >= minimumRequiredRatio,
            label: pair.label,
          };
        });

        setContrastResults(results);

        const failing = results
          .filter((result) => !result.isValid)
          .map((result) => result.label);

        setFailingPairs(failing);
      } catch (error) {
        console.error("Error checking contrast:", error);
        setContrastResults([]);
        setFailingPairs([]);
      }
    }, 750),
    [minimumRequiredRatio]
  );

  useEffect(() => {
    debouncedCalculation(colorPairs);
  }, [colorPairs, debouncedCalculation]);

  return {
    contrastResults,
    failingPairs,
    hasFailingContrast: failingPairs.length > 0,
    minimumRequiredRatio,
  };
}
