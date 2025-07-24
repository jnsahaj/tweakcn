// Tweakcn Live Preview Embed Script
// Enables live theme updates for external websites using shadcn/ui

const TWEAKCN_MESSAGE = {
  PING: "TWEAKCN_PING",
  PONG: "TWEAKCN_PONG",
  CHECK_SHADCN: "TWEAKCN_CHECK_SHADCN",
  SHADCN_STATUS: "TWEAKCN_SHADCN_STATUS",
  THEME_UPDATE: "TWEAKCN_THEME_UPDATE",
  THEME_APPLIED: "TWEAKCN_THEME_APPLIED",
  EMBED_LOADED: "TWEAKCN_EMBED_LOADED",
};

// Required shadcn/ui CSS variables for detection
const REQUIRED_SHADCN_VARS = [
  "--background",
  "--foreground", 
  "--primary",
  "--card",
  "--radius",
];

const updateThemeClass = (root, mode) => {
  root.classList.toggle("dark", mode === "dark");
};

const applyStyleProperty = (root, key, value) => {
  if (typeof value === "string" && value.trim()) {
    root.style.setProperty(`--${key}`, value);
  }
};

const applyThemeStyles = (root, themeStyles, mode) => {
  // Apply light theme styles first (base styles)
  const lightStyles = themeStyles.light || {};
  for (const [key, value] of Object.entries(lightStyles)) {
    applyStyleProperty(root, key, value);
  }

  // Apply dark mode overrides if in dark mode
  if (mode === "dark" && themeStyles.dark) {
    for (const [key, value] of Object.entries(themeStyles.dark)) {
      applyStyleProperty(root, key, value);
    }
  }
};

const checkShadcnSupport = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const hasSupport = REQUIRED_SHADCN_VARS.every(
    (v) => rootStyles.getPropertyValue(v).trim() !== ""
  );
  return { supported: hasSupport };
};

const applyTheme = (themeState) => {
  const root = document.documentElement;
  if (!root || !themeState || !themeState.styles) {
    console.warn("Tweakcn Embed: Missing root element or theme styles.");
    return;
  }

  const { currentMode: mode, styles: themeStyles } = themeState;

  // Follow the same pattern as utils/apply-theme.ts
  updateThemeClass(root, mode);
  applyThemeStyles(root, themeStyles, mode);
};

const sendMessageToParent = (message) => {
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(message, "*");
    } catch (error) {
      console.warn("Tweakcn Embed: Failed to send message to parent:", error);
    }
  }
};

(() => {
  "use strict";
  
  // Prevent multiple initialization
  if (window.TweakcnEmbed) return; 

  const handleMessage = (event) => {
    // Verify the message is from the parent window
    if (event.source !== window.parent) return;
    // Verify the message has the expected structure
    if (!event.data || typeof event.data.type !== "string") return;
    
    const { type, payload } = event.data;

    switch (type) {
      case TWEAKCN_MESSAGE.PING:
        sendMessageToParent({ type: TWEAKCN_MESSAGE.PONG });
        break;

      case TWEAKCN_MESSAGE.CHECK_SHADCN:
        const supportInfo = checkShadcnSupport();
        sendMessageToParent({
          type: TWEAKCN_MESSAGE.SHADCN_STATUS,
          payload: supportInfo,
        });
        break;

      case TWEAKCN_MESSAGE.THEME_UPDATE:
        if (payload && payload.themeState) {
          applyTheme(payload.themeState);
          sendMessageToParent({ type: TWEAKCN_MESSAGE.THEME_APPLIED });
        }
        break;

      default:
        // Ignore unknown message types
        break;
    }
  };

  window.addEventListener("message", handleMessage);

  window.TweakcnEmbed = {
    initialized: true,
    version: "1.0.0",
    destroy: () => {
      window.removeEventListener("message", handleMessage);
      delete window.TweakcnEmbed;
    },
  };

  // Announce that the embed script is ready
  sendMessageToParent({ type: TWEAKCN_MESSAGE.EMBED_LOADED });
})(); 