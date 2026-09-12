import { colorFormatter } from "./color-converter";
import { applyStyleToElement } from "./apply-style-to-element";
import { ThemeEditorState } from "../types/editor";
import { defaultThemeState } from "../config/theme";

export const getShadowMap = (themeEditorState: ThemeEditorState) => {
  const mode = themeEditorState.currentMode;
  const styles = {
    ...defaultThemeState.styles[mode],
    ...themeEditorState.styles[mode],
  };

  const shadowColor = styles["shadow-color"];
  const hsl = colorFormatter(shadowColor, "hsl", "3");
  const offsetX = styles["shadow-offset-x"];
  const offsetY = styles["shadow-offset-y"];
  const blur = styles["shadow-blur"];
  const spread = styles["shadow-spread"];
  const opacity = parseFloat(styles["shadow-opacity"]);
  const color = (opacityMultiplier: number) =>
    `hsl(${hsl} / ${(opacity * opacityMultiplier).toFixed(2)})`;

  const secondLayer = (fixedOffsetY: string, fixedBlur: string): string => {
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
  //
  // NOTE: this fully-composed map is kept for the shadcn/v0 registry exporters
  // (utils/registry/themes.ts, utils/registry/v0.ts), which hand a literal
  // `cssVars` value to an external tool (the shadcn CLI / v0.dev) that we don't
  // control the CSS pipeline of, so it can't participate in the @utility-based
  // fix below. The live editor and the CSS code panel (Tailwind v4 export) do
  // NOT use this map anymore -- see setShadowVariables and app/globals.css.
  const shadowMap: { [key: string]: string } = {
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

// Function to set shadow CSS variables
//
// This used to call getShadowMap() and write the fully-composed box-shadow
// string (offsets + blur + spread + a literal color) straight into
// `--shadow-md` etc, which app/globals.css's `@theme inline` block then
// exposed 1:1 as the `shadow-md` utility's value. That baked the theme's
// shadow color into the utility itself, so a `shadow-{color}` utility class
// (e.g. `shadow-blue-500`) had nothing to override -- see #124.
//
// Instead we now only publish the raw *pieces* (offset/blur/spread/opacity
// and the shadow color itself) as plain, non-nested custom properties --
// the same --shadow-x/-y/-blur/-spread/-opacity/-color names
// theme-style-generator.ts's generateRawShadowVariables already exports in
// the CSS code panel. app/globals.css composes the actual box-shadow value
// per shadow size via hand-written `@utility` rules that reference
// `var(--tw-shadow-color, hsl(from var(--shadow-color) h s l / ...))`
// directly in the rule that targets the element -- the same place
// Tailwind's own built-in shadow utilities put that fallback. That's
// required for the override to work at all: a CSS custom property that's
// merely *inherited* (like `--shadow-md` was) resolves any var() inside it
// once, at the element where it's declared (`:root`), so overriding
// `--tw-shadow-color` lower in the tree can never reach back into it.
export function setShadowVariables(themeEditorState: ThemeEditorState) {
  const root = document.documentElement;
  const mode = themeEditorState.currentMode;
  const styles = {
    ...defaultThemeState.styles[mode],
    ...themeEditorState.styles[mode],
  };

  applyStyleToElement(root, "shadow-x", styles["shadow-offset-x"]);
  applyStyleToElement(root, "shadow-y", styles["shadow-offset-y"]);
  applyStyleToElement(root, "shadow-blur", styles["shadow-blur"]);
  applyStyleToElement(root, "shadow-spread", styles["shadow-spread"]);
  applyStyleToElement(root, "shadow-opacity", styles["shadow-opacity"]);
  // Match the "hsl(...)" (not bare triplet) convention apply-theme.ts already
  // uses for every other color custom property it sets on documentElement.
  applyStyleToElement(root, "shadow-color", colorFormatter(styles["shadow-color"], "hsl", "4"));
}
