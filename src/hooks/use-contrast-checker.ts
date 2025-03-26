import { useState, useEffect, useCallback } from "react";
import { getContrastRatio } from "../utils/contrast-checker";
import { debounce } from "../utils/debounce";

/**
 * Hook that checks if the contrast between two colors meets accessibility standards
 * @param foregroundColor - Text color or foreground element color
 * @param backgroundColor - Background color
 * @returns Object with contrast information and whether it meets WCAG AA requirements
 */
export function useContrastChecker(
  foregroundColor: string,
  backgroundColor: string
) {
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [isPassingContrastCheck, setIsPassingContrastCheck] =
    useState<boolean>(false);
  const minimumRequiredRatio = 4.5; // WCAG AA standard for normal text

  const debouncedCalculation = useCallback(
    debounce((fg: string, bg: string) => {
      if (!fg || !bg) {
        setContrastRatio(0);
        setIsPassingContrastCheck(false);
        return;
      }

      try {
        const ratio = parseFloat(getContrastRatio(fg, bg));
        setContrastRatio(ratio);
        setIsPassingContrastCheck(ratio >= minimumRequiredRatio);
      } catch (error) {
        console.error("Error while checking contrast:", error);
        setContrastRatio(0);
        setIsPassingContrastCheck(false);
      }
    }, 750),
    [minimumRequiredRatio]
  );

  const calculateContrast = useCallback(
    (fg: string, bg: string) => {
      debouncedCalculation(fg, bg);
    },
    [debouncedCalculation]
  );

  useEffect(() => {
    calculateContrast(foregroundColor, backgroundColor);
  }, [foregroundColor, backgroundColor, calculateContrast]);

  return {
    contrastRatio,
    isPassingContrastCheck,
    minimumRequiredRatio,
  };
}
