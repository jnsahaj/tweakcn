// ----- SHADCN SUPPORT -----
const REQUIRED_SHADCN_VARS = [
  "--radius",
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--border",
  "--input",
  "--ring",
]

function checkShadcnSupport() {
  const rootStyles = getComputedStyle(document.documentElement);
  const hasSupport = REQUIRED_SHADCN_VARS.every(
    (v) => rootStyles.getPropertyValue(v).trim() !== ""
  );
  return { supported: hasSupport };
};

// ----- FONT LOADING UTILITIES -----
const DEFAULT_FONT_WEIGHTS = ["400", "500", "600", "700"];

function extractFontFamily(fontFamilyValue) {
  if (!fontFamilyValue) return null;
  const firstFont = fontFamilyValue.split(",")[0].trim();
  const cleanFont = firstFont.replace(/['"]/g, "");
  const systemFonts = [
    "ui-sans-serif", "ui-serif", "ui-monospace", "system-ui",
    "sans-serif", "serif", "monospace", "cursive", "fantasy"
  ];
  if (systemFonts.includes(cleanFont.toLowerCase())) return null;
  return cleanFont;
}

function buildFontCssUrl(family, weights) {
  weights = weights || DEFAULT_FONT_WEIGHTS;
  const encodedFamily = encodeURIComponent(family);
  const weightsParam = weights.join(";"); 
  return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightsParam}&display=swap`;
}

function loadGoogleFont(family, weights) {
  weights = weights || DEFAULT_FONT_WEIGHTS;
  const href = buildFontCssUrl(family, weights);
  const existing = document.querySelector(`link[href="${href}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function overrideFontClasses(root, fonts) {
  const doc = root.ownerDocument || document;
  const styleId = "tweakcn-font-overrides";
  let styleElement = doc.getElementById(styleId);
  
  // Create style element if it doesn't exist
  if (!styleElement) {
    styleElement = doc.createElement("style");
    styleElement.id = styleId;
    doc.head.appendChild(styleElement);
  }

  // Build CSS rules for font class overrides
  const cssRules = [];
  if (fonts.sans) {
    cssRules.push(`.font-sans { font-family: ${fonts.sans} !important; }`);
  }
  if (fonts.serif) {
    cssRules.push(`.font-serif { font-family: ${fonts.serif} !important; }`);
  }
  if (fonts.mono) {
    cssRules.push(`.font-mono { font-family: ${fonts.mono} !important; }`);
  }

  styleElement.textContent = cssRules.join("\n");
}

function overrideShadowClass(root, themeStyles, mode) {

  const getShadowMap = (themeStyles, mode) => {
    const styles = themeStyles[mode]

    const shadowColor = styles["shadow-color"];
    const offsetX = styles["shadow-offset-x"];
    const offsetY = styles["shadow-offset-y"];
    const blur = styles["shadow-blur"];
    const spread = styles["shadow-spread"];
    const opacity = parseFloat(styles["shadow-opacity"]);
    const color = (opacityMultiplier) =>
      `color-mix(in srgb, ${shadowColor} calc(${opacity * opacityMultiplier} * 100%), transparent)`;

    const secondLayer = (fixedOffsetY, fixedBlur) => {
      // Use the same offsetX as the first layer
      const offsetX2 = offsetX;
      // Use the fixed offsetY specific to the shadow size
      const offsetY2 = fixedOffsetY;
      // Use the fixed blur specific to the shadow size
      const blur2 = fixedBlur;
      // Calculate spread relative to the first layer's spread variable
      const spread2 = (parseFloat(spread?.replace("px", "") ?? "0") - 1).toString() + "px";
      // Use the same color function (opacity can still be overridden by --shadow-opacity)
      const color2 = color(1.0); // Default opacity for second layer is 0.1 in examples

      return `${offsetX2} ${offsetY2} ${blur2} ${spread2} ${color2}`;
    };

    // Map shadow names to their CSS variable string structures
    const shadowMap = {
      // Single layer shadows - use base variables directly
      "shadow-2xs": `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`, // Assumes vars set appropriately (e.g., y=1, blur=0, spread=0)
      "shadow-xs": `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`, // Assumes vars set appropriately (e.g., y=1, blur=2, spread=0)
      "shadow-2xl": `${offsetX} ${offsetY} ${blur} ${spread} ${color(2.5)}`, // Assumes vars set appropriately (e.g., y=25, blur=50, spread=-12)

      // Two layer shadows - use base vars for layer 1, mix fixed/calculated for layer 2
      "shadow-sm": `${offsetX} ${offsetY} ${blur} ${spread} ${color(
        1.0
      )}, ${secondLayer("1px", "2px")}`,
      shadow: `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer("1px", "2px")}`, // Alias for the 'shadow:' example line

      "shadow-md": `${offsetX} ${offsetY} ${blur} ${spread} ${color(
        1.0
      )}, ${secondLayer("2px", "4px")}`,

      "shadow-lg": `${offsetX} ${offsetY} ${blur} ${spread} ${color(
        1.0
      )}, ${secondLayer("4px", "6px")}`,

      "shadow-xl": `${offsetX} ${offsetY} ${blur} ${spread} ${color(
        1.0
      )}, ${secondLayer("8px", "10px")}`,
    };

    return shadowMap;
  };

  const doc = root.ownerDocument || document;
  const styleId = "tweakcn-shadow-overrides";
  let styleElement = doc.getElementById(styleId);
  
  // Create style element if it doesn't exist
  if (!styleElement) {
    styleElement = doc.createElement("style");
    styleElement.id = styleId;
    doc.head.appendChild(styleElement);
  }

  const shadowMap = getShadowMap(themeStyles, mode)

  // Build CSS rules for font class overrides
  const cssRules = [];
  Object.entries(shadowMap).forEach(([name, value]) => {
    cssRules.push(`.${name} { box-shadow: ${value} !important; }`);
  });

  styleElement.textContent = cssRules.join("\n");
}

function loadThemeFonts(root, themeStyles) {
  try {
    const currentFonts = {
      sans: themeStyles["font-sans"],
      serif: themeStyles["font-serif"],
      mono: themeStyles["font-mono"],
    };
  
     Object.entries(currentFonts).forEach(([_type, fontValue]) => {
      const fontFamily = extractFontFamily(fontValue);
      if (fontFamily) {
        loadGoogleFont(fontFamily, DEFAULT_FONT_WEIGHTS);
      }
    });    

    // Override font classes with theme fonts
    overrideFontClasses(root, currentFonts);
  } catch (error) {
    console.warn("Tweakcn Embed: Failed to load fonts:", error);
  }
}

// ----- THEME STYLES APPLICATION -----
function applyStyleProperty(root, key, value) {
  if (typeof value === "string" && value.trim()) {
    root.style.setProperty(`--${key}`, value);
  }
};

function updateThemeModeClass(root, mode) {
  root.classList.toggle("dark", mode === "dark");
};

function applyThemeStyles(root, themeStyles, mode) {
  updateThemeModeClass(root, mode);
  // Apply light theme styles first (base styles)
  const lightStyles = themeStyles.light || {};
  for (const [key, value] of Object.entries(lightStyles)) {
    applyStyleProperty(root, key, value);
  }

  // Apply dark mode overrides
  const darkStyles = themeStyles.dark;
  if (mode === "dark" && darkStyles) {
    for (const [key, value] of Object.entries(darkStyles)) {
      applyStyleProperty(root, key, value);
    }
  }

  loadThemeFonts(root, lightStyles);  
  overrideShadowClass(root, themeStyles, mode)
};

function applyTheme(themeState) {
  const root = document.documentElement;
  if (!root || !themeState || !themeState.styles) {
    console.warn("Tweakcn Embed: Missing root element or theme styles.");
    return;
  }

  const { currentMode: mode, styles: themeStyles } = themeState; 
  applyThemeStyles(root, themeStyles, mode);
};

// ----- MESSAGE SENDING -----
function sendMessageToParent(message) {
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(message, "*");
    } catch (error) {
      console.warn("Tweakcn Embed: Failed to send message to parent:", error);
    }
  }
};

const TWEAKCN_MESSAGE = {
  PING: "TWEAKCN_PING",
  PONG: "TWEAKCN_PONG",
  CHECK_SHADCN: "TWEAKCN_CHECK_SHADCN",
  SHADCN_STATUS: "TWEAKCN_SHADCN_STATUS",
  THEME_UPDATE: "TWEAKCN_THEME_UPDATE",
  THEME_APPLIED: "TWEAKCN_THEME_APPLIED",
  EMBED_LOADED: "TWEAKCN_EMBED_LOADED",
  EMBED_ERROR: "TWEAKCN_EMBED_ERROR",
};

// ----- MAIN SCRIPT -----
(() => {
  "use strict";
  
  // Prevent multiple initialization
  if (window.tweakcnEmbed) return; 

  const handleMessage = (event) => {
    // Verify the message is from the parent window
    if (event.source !== window.parent) return;
    // Verify the message has the expected structure
    if (!event.data || typeof event.data.type !== "string") return;

    // TODO: Remove localhost once this is live
    const ALLOWED_ORIGINS = ['https://tweakcn.com', 'http://localhost:3000'];
    if (!ALLOWED_ORIGINS.includes(event.origin)){
      sendMessageToParent({ type: TWEAKCN_MESSAGE.EMBED_ERROR, payload: { error: "Origin not allowed. Preview failed to establish the connection with tweakcn." } });
      return;
    } ;    
    
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

  window.tweakcnEmbed = {
    initialized: true,
    version: "1.0.0",
    destroy: () => {
      window.removeEventListener("message", handleMessage);
      delete window.tweakcnEmbed;
    },
  };

  // Announce that the embed script is ready
  sendMessageToParent({ type: TWEAKCN_MESSAGE.EMBED_LOADED });
})(); 