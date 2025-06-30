# Reusable Theme Selector

This is a self-contained component that fetches, displays, and allows selection of themes from a `registry.json` file. It's designed to be reusable in any React application.

## How to Use

1.  **Copy to Your Project**: Copy the `reusable-theme-selector` and `theme-preset-selector` directories into your project's `components` directory.

2.  **Import and Use**: Import the `ReusableThemeSelector` and provide it with the necessary props.

    -   `registryUrl`: The URL to your `registry.json` file. This file should contain an `items` array of theme objects.
    -   `onThemeSelect`: A callback function that receives the selected theme's `styles` object (`{ light: { ... }, dark: { ... } }`). You can use this to apply the theme in your application's state management.
    -   `currentMode` (optional): `"light"` or `"dark"`. This is used to display the correct color previews in the selector UI. Defaults to `"light"`.

## Example

Here's how you might use it in a Next.js page, connecting it to your application's state.

```tsx
// app/your-page/page.tsx
"use client";

import { ReusableThemeSelector } from "@/components/reusable-theme-selector";
// This is your app's specific state management store
import { useYourAppStore } from "@/store/your-app-store"; 

function YourPageComponent() {
  const { themeState, setAppThemeStyles } = useYourAppStore();

  // Define the handler to receive the theme styles from the component
  const handleThemeSelect = (themeStyles: { light: Record<string, string>; dark: Record<string, string> }) => {
    // Call your app's state management function to apply the theme
    setAppThemeStyles(themeStyles);
  };

  return (
    <div>
      <h2>Select a Theme</h2>
      <ReusableThemeSelector
        registryUrl="/path/to/your/registry.json"
        onThemeSelect={handleThemeSelect}
        currentMode={themeState.currentMode}
      />
    </div>
  );
} 