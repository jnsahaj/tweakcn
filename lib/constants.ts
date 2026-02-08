export const AI_PROMPT_CHARACTER_LIMIT = 500;

export const DEBOUNCE_DELAY = 50;

export const AI_REQUEST_FREE_TIER_LIMIT = 5;

export const MAX_IMAGE_FILES = 2;
export const MAX_IMAGE_FILE_SIZE = 4 * 1024 * 1024; // 4MB
export const MAX_SVG_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export const MAX_FREE_THEMES = 10;

export const COMMUNITY_THEMES_PAGE_SIZE = 20;

export const COMMUNITY_THEME_TAGS = [
  "colorful",
  "minimal",
  "professional",
  "playful",
  "warm",
  "cool",
  "high-contrast",
  "pastel",
  "earthy",
  "neon",
  "retro",
  "futuristic",
  "nature",
  "monochrome",
  "vibrant",
  "elegant",
  "bold",
  "soft",
  "gradient",
  "flat",
  "glassmorphism",
  "neumorphism",
  "brutalist",
  "corporate",
  "startup",
  "dashboard",
  "e-commerce",
  "portfolio",
  "blog",
  "saas",
  "landing-page",
  "ocean",
  "sunset",
  "forest",
  "candy",
  "midnight",
  "nordic",
  "tropical",
  "autumn",
  "winter",
  "spring",
  "cyberpunk",
  "vintage",
  "art-deco",
  "industrial",
  "zen",
  "accessible",
  "romantic",
  "geometric",
] as const;

export const MAX_TAGS_PER_THEME = 5;

// OAuth 2.0 Token Expiry
export const OAUTH_ACCESS_TOKEN_EXPIRY_SECONDS = 60 * 60; // 1 hour
export const OAUTH_REFRESH_TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const OAUTH_AUTHORIZATION_CODE_EXPIRY_SECONDS = 60 * 10; // 10 minutes
