# tw-animate-css

TailwindCSS v4.0 compatible replacement for [`tailwindcss-animate`][Original_Plugin_GitHub].

Instead of being an old-fashioned JavaScript plugin, this package provides a
CSS file defining custom utilities based on the new
[CSS-first architecture][TailwindCSS_Custom_Utilities].

## Installation

### NPM

1. Install the package with `npm`:

   ```bash
   npm install -D tw-animate-css
   ```

2. Add the following line to your `app.css` or `globals.css` file:

   ```css
   @import "tw-animate-css";
   ```

3. Start using the animations!

> [!NOTE]
> This code works with esbuild, Vite and probably other bundlers too. If you are
> using a different bundler, the syntax may differ.
> [Let me know][Create_Issue] how it works and I'll update the documentation.

### Manual download

1. Download the [`tw-animate.css`][CSS_File]
   file from GitHub and place it next to your `app.css` or `globals.css` file.
2. Add the following line to your `app.css` or `globals.css` file:

   ```css
   @import "./tw-animate.css";
   ```

3. Start using the animations!

## Usage

> [!NOTE]
> The documentation is currently under construction. Please refer to the [original documentation][Original_Plugin_Docs] for now.
>
> I added the `accordion-down`, `accordion-up` and `caret-blink` animations to the package. They still need their final touches,
> but I thought I let you know. And you can already use them with the default values.

---

> [!NOTE]
> I use very litte of the original library, so it might not be a 100% compatible
> drop-in replacement. If you notice any inconsistencies, feel free to contribute
> to this repository by opening a pull-request.

<!-- Links -->

[Original_Plugin_GitHub]: https://github.com/jamiebuilds/tailwindcss-animate
[Original_Plugin_Docs]: https://github.com/jamiebuilds/tailwindcss-animate/blob/main/README.md
[TailwindCSS_Custom_Utilities]: https://tailwindcss.com/docs/adding-custom-styles#adding-custom-utilities
[Create_Issue]: https://github.com/Wombosvideo/tw-animate-css/issues/new
[CSS_File]: https://raw.githubusercontent.com/Wombosvideo/tw-animate-css/refs/heads/main/src/tw-animate.css
