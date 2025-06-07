export const PROMPTS = {
  flatDesign: {
    label: "Flat Design",
    prompt:
      "I want a flat design. Make the surface color tokens use the same color value, preferably the same as the 'background' color. Remove shadows completely. Default 'border' styles are okay.",
  },
  minimalStyle: {
    label: "Minimal Style",
    prompt:
      "Generate a minimalist theme palette. All surfaces color tokens should use subtle variations of the same base color, with enough contrast to distinguish them when they are next to each other. For brand colors, keep original color palette. Minimize borders and shadows. For borders, use a subtle grayscale color. Typography should be clean, modern, and easy to read.",
  },
  brutalist: {
    label: "Make it Brutalist",
    prompt:
      "Make it brutalist style. Set 'radius' to '0px'. The 'border' color should strongly contrast with the 'background' color. For shadows, use a 'shadow-color' that also contrasts sharply with the 'background', set 'shadow-blur' to '0px', 'shadow-opacity' to '100%', and use 'shadow-offset', and 'shadow-spread' to create a hard offset shadow effect, do not exceed 4px. Keep original color palette, and make colors slightly more vibrant.",
  },
};
