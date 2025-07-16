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
    label: "Brutalist Vibe",
    prompt:
      "Make it brutalist style. Set 'radius' to '0px'. The 'border' color should strongly contrast with the 'background' color. For shadows, use a 'shadow-color' that also contrasts sharply with the 'background', set 'shadow-blur' to '0px', 'shadow-opacity' to '100%', and use 'shadow-offset', and 'shadow-spread' to create a hard offset shadow effect, do not exceed 4px. Keep original color palette, and make colors slightly more vibrant.",
  },
};

interface RemixPrompt {
  displayContent: string;
  prompt: string;
  basePreset: string;
}

interface Prompt {
  displayContent: string;
  prompt: string;
}

export const CREATE_PROMPTS: Prompt[] = [
  {
    displayContent: "JavaScript/TypeScript Advent of Code playground",
    prompt:
      "Create a retro JavaScript Advent of Code theme. Use a grayish background with JavaScript yellow and TypeScript blue as primary/secondary colors. Change all fonts to monospace. Make borders sharp.",
  },
  {
    displayContent: "Retro Terminal UI, green phosphor glow",
    prompt:
      "Create a retro terminal theme with black background (dark mode) and grayish background (light mode), use phosphorescent pure green (#22FF22 and shades of it) for text and borders. Use monospace fonts and sharp borders.",
  },
  {
    displayContent: "Monochrome Manga-inspired theme",
    prompt:
      "Create a Manga-inspired theme. Monochromatic palette only (black, off-white, grays), square corners, small contrast solid offset shadows, and high-contrast borders (black on light, off-white on dark). Use a playful font, like Architects daughter.",
  },
  {
    displayContent: "I want a minimal Ghibli Studio vibe",
    prompt:
      "Generate a theme inspired by Studio Ghibli — soft pastels, natural greens, organic colors, and hand-drawn charm.",
  },
];

export const REMIX_PROMPTS: RemixPrompt[] = [
  {
    displayContent: "Make @Twitter but in a slick purple",
    prompt: "Make @Twitter but in a slick purple",
    basePreset: "twitter",
  },
  {
    displayContent: "What if @Supabase was vibrant blue?",
    prompt: "Make @Supabase but in vibrant blue",
    basePreset: "supabase",
  },
  {
    displayContent: "I want @Doom 64 with muted colors",
    prompt: "I want @Doom 64 with alternate colors",
    basePreset: "doom-64",
  },
];

export const VARIANT_PROMPTS: Prompt[] = [
  {
    displayContent: "Make my @Current Theme minimalistic",
    prompt: PROMPTS.minimalStyle.prompt,
  },
  {
    displayContent: "Flatten the colors of my @Current Theme",
    prompt: PROMPTS.flatDesign.prompt,
  },
  {
    displayContent: "Create a brutalist variant of my @Current Theme",
    prompt: PROMPTS.brutalist.prompt,
  },
];
