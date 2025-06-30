# Reusable Theme Changer Component

This directory contains a reusable theme changing component for Next.js applications.

## Files

- `theme-provider.tsx`: The core `ThemeProvider` component that manages theme state.
- `theme-toggle.tsx`: A UI component (`ThemeToggle`) for switching between light, dark, and system themes.
- `index.ts`: Exports the main components for easy importing.

## How to Use

1.  **Copy to Your Project**: Copy the `theme-changer` directory into the `components` directory of your Next.js project.

2.  **Wrap Your Layout with `ThemeProvider`**: In your `layout.tsx` file, import and wrap the main content with the `ThemeProvider`.

    ```tsx
    // app/layout.tsx
    import { ThemeProvider } from "@/components/theme-changer";

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en" suppressHydrationWarning>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      );
    }
    ```

3.  **Add the `ThemeToggle` Component**: Place the `ThemeToggle` component wherever you want the theme switching UI to appear (e.g., in your header or navigation bar).

    ```tsx
    // components/header.tsx
    import { ThemeToggle } from "@/components/theme-changer";

    export function Header() {
      return (
        <header>
          {/* Other header content */}
          <ThemeToggle />
        </header>
      );
    }
    ```

4.  **Configure Tailwind CSS**: Ensure your `tailwind.config.js` is set up to use the `class` strategy for dark mode.

    ```js
    // tailwind.config.js
    module.exports = {
      darkMode: "class",
      // ... other configurations
    };
    ``` 