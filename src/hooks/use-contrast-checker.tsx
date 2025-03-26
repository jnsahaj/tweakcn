import { useState, useEffect } from "react";
import { getContrastRatio } from "../utils/contrast-checker";

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

  useEffect(() => {
    if (!foregroundColor || !backgroundColor) {
      setContrastRatio(0);
      setIsPassingContrastCheck(false);
      return;
    }

    try {
      const ratio = parseFloat(getContrastRatio(foregroundColor, backgroundColor));
      setContrastRatio(ratio);
      setIsPassingContrastCheck(ratio >= minimumRequiredRatio);
    } catch (error) {
      console.error("Error while checking contrast:", error);
      setContrastRatio(0);
      setIsPassingContrastCheck(false);
    }
  }, [foregroundColor, backgroundColor]);

  return {
    contrastRatio,
    isPassingContrastCheck,
    minimumRequiredRatio,
  };
}
