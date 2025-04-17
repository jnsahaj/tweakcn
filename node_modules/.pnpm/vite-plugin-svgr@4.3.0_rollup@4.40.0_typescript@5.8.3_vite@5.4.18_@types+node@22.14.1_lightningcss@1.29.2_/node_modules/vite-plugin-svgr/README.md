# vite-plugin-svgr

[![npm](https://img.shields.io/npm/v/vite-plugin-svgr.svg)](https://www.npmjs.com/package/vite-plugin-svgr)

Vite plugin to transform SVGs into React components. Uses [svgr](https://github.com/gregberge/svgr) under the hood.

## Installation

```sh
# npm
npm install --save-dev vite-plugin-svgr

# yarn
yarn add -D vite-plugin-svgr

# pnpm
pnpm add -D vite-plugin-svgr
```

## Usage

```js
// vite.config.js
import svgr from "vite-plugin-svgr";

export default {
  // ...
  plugins: [svgr()],
};
```

Then SVG files can be imported as React components:

```js
import Logo from "./logo.svg?react";
```

If you are using TypeScript, there is also a declaration helper for better type inference. Add the following to `vite-env.d.ts`:

```ts
/// <reference types="vite-plugin-svgr/client" />
```

### Options

```js
svgr({
  // svgr options: https://react-svgr.com/docs/options/
  svgrOptions: {
    // ...
  },

  // esbuild options, to transform jsx to js
  esbuildOptions: {
    // ...
  },

  // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
  include: "**/*.svg?react",

  //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
  exclude: "",
});
```

If you want to enable SVGO you can install `@svgr/plugin-svgo` and use following options to enable and configure it:

```js
svgr({
  svgrOptions: {
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    svgoConfig: {
      floatPrecision: 2,
    },
  },
  // ...
});
```

## License

MIT
