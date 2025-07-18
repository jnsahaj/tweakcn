export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export function validateSvgContent(svgText: string): boolean {
  try {
    const trimmed = svgText.trim();
    if (!trimmed.toLowerCase().includes("<svg")) {
      return false;
    }

    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick, onload, etc.
      /<embed/i,
      /<object/i,
      /<iframe/i,
    ];

    return !dangerousPatterns.some((pattern) => pattern.test(svgText));
  } catch {
    return false;
  }
}

export function optimizeSvgContent(svgText: string): string {
  try {
    return svgText
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/>\s+</g, "><") // Remove unnecessary whitespace
      .trim();
  } catch {
    return svgText.trim();
  }
}
