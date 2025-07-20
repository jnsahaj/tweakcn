
(() => {
  // --- Start of Utility Functions ---
  console.log("RUNNING EMBED SCRIPT");

  // Color conversion utility
  const colorFormatter = (color, format = "hsl", withAlpha = "4") => {
    // This is a simplified version for the embed script.
    // A more robust implementation would handle various color formats.
    if (color.startsWith("hsl")) {
      const values = color.match(/(\d+(\.\d+)?)/g);
      if (values && values.length >= 3) {
        if (withAlpha === "4" && values.length === 3) {
          return `hsl(${values[0]} ${values[1]}% ${values[2]}%)`;
        }
        return `hsl(${values[0]} ${values[1]}% ${values[2]}% / ${values[3] || 1})`;
      }
    }
    return color; // Fallback
  };

  // Style application utility
  const applyStyleToElement = (element, key, value) => {
    element.style.setProperty(`--${key}`, value);
  };

  // Shadow variable utility
  const setShadowVariables = (themeState) => {
    // In a real scenario, you would port the shadow generation logic here.
    // For this script, we'll assume shadows are part of the theme styles.
  };

  const COMMON_STYLES = [
    "border-radius",
    "box-shadow",
    "font-family",
    "font-size",
  ];

  // --- End of Utility Functions ---

  // Main function to apply the theme
  const applyTheme = (themeState) => {
    const root = document.documentElement;
    if (!root || !themeState || !themeState.styles) {
      console.error("iframe: ROOT NOT FOUND");
      return;
    }

    const { currentMode: mode, styles: themeStyles } = themeState;

    // Apply common styles
    Object.entries(themeStyles.light).forEach(([key, value]) => {
      if (COMMON_STYLES.includes(key) && typeof value === "string") {
        applyStyleToElement(root, key, value);
      }
    });

    // Apply mode-specific colors
    Object.entries(themeStyles[mode]).forEach(([key, value]) => {
      if (typeof value === "string" && !COMMON_STYLES.includes(key)) {
        const hslValue = colorFormatter(value, "hsl", "4");
        applyStyleToElement(root, key, hslValue);
      }
    });

    setShadowVariables(themeState);
  };

  // Event listener for postMessage
  window.addEventListener("message", (event) => {
    // IMPORTANT: In a production environment, you MUST validate the origin
    // to ensure messages are only accepted from trusted sources.
    // Example: if (event.origin !== "https://your-trusted-domain.com") return;

    console.log("MESSAGE PROCESSING")

    if (event.data && event.data.type === "theme-change") {
      console.log("APPLYING THEME", event.data);
      applyTheme(event.data.themeState);
    }
  });

  console.log("TweakCN embed script loaded.");
})();
