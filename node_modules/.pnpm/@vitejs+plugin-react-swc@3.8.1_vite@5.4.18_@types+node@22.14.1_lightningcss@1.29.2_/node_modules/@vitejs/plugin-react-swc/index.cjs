// src/index.ts
var import_fs = require("fs");
var import_path = require("path");
var import_url = require("url");
var import_core = require("@swc/core");
var import_module = require("module");
var import_meta = {};
var runtimePublicPath = "/@react-refresh";
var preambleCode = `import { injectIntoGlobalHook } from "__PATH__";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;`;
var _dirname = typeof __dirname !== "undefined" ? __dirname : (0, import_path.dirname)((0, import_url.fileURLToPath)(import_meta.url));
var resolve = (0, import_module.createRequire)(
  typeof __filename !== "undefined" ? __filename : import_meta.url
).resolve;
var reactCompRE = /extends\s+(?:React\.)?(?:Pure)?Component/;
var refreshContentRE = /\$Refresh(?:Reg|Sig)\$\(/;
var react = (_options) => {
  let hmrDisabled = false;
  const options = {
    jsxImportSource: (_options == null ? void 0 : _options.jsxImportSource) ?? "react",
    tsDecorators: _options == null ? void 0 : _options.tsDecorators,
    plugins: (_options == null ? void 0 : _options.plugins) ? _options == null ? void 0 : _options.plugins.map((el) => [resolve(el[0]), el[1]]) : void 0,
    devTarget: (_options == null ? void 0 : _options.devTarget) ?? "es2020",
    parserConfig: _options == null ? void 0 : _options.parserConfig,
    useAtYourOwnRisk_mutateSwcOptions: _options == null ? void 0 : _options.useAtYourOwnRisk_mutateSwcOptions
  };
  return [
    {
      name: "vite:react-swc:resolve-runtime",
      apply: "serve",
      enforce: "pre",
      // Run before Vite default resolve to avoid syscalls
      resolveId: (id) => id === runtimePublicPath ? id : void 0,
      load: (id) => id === runtimePublicPath ? (0, import_fs.readFileSync)((0, import_path.join)(_dirname, "refresh-runtime.js"), "utf-8") : void 0
    },
    {
      name: "vite:react-swc",
      apply: "serve",
      config: () => ({
        esbuild: false,
        optimizeDeps: {
          include: [`${options.jsxImportSource}/jsx-dev-runtime`],
          esbuildOptions: { jsx: "automatic" }
        }
      }),
      configResolved(config) {
        if (config.server.hmr === false) hmrDisabled = true;
        const mdxIndex = config.plugins.findIndex(
          (p) => p.name === "@mdx-js/rollup"
        );
        if (mdxIndex !== -1 && mdxIndex > config.plugins.findIndex((p) => p.name === "vite:react-swc")) {
          throw new Error(
            "[vite:react-swc] The MDX plugin should be placed before this plugin"
          );
        }
      },
      transformIndexHtml: (_, config) => [
        {
          tag: "script",
          attrs: { type: "module" },
          children: preambleCode.replace(
            "__PATH__",
            config.server.config.base + runtimePublicPath.slice(1)
          )
        }
      ],
      async transform(code, _id, transformOptions) {
        const id = _id.split("?")[0];
        const refresh = !(transformOptions == null ? void 0 : transformOptions.ssr) && !hmrDisabled;
        const result = await transformWithOptions(
          id,
          code,
          options.devTarget,
          options,
          {
            refresh,
            development: true,
            runtime: "automatic",
            importSource: options.jsxImportSource
          }
        );
        if (!result) return;
        if (!refresh) return result;
        const hasRefresh = refreshContentRE.test(result.code);
        if (!hasRefresh && !reactCompRE.test(result.code)) return result;
        const sourceMap = JSON.parse(result.map);
        sourceMap.mappings = ";;" + sourceMap.mappings;
        result.code = `import * as RefreshRuntime from "${runtimePublicPath}";

${result.code}`;
        if (hasRefresh) {
          sourceMap.mappings = ";;;;;;" + sourceMap.mappings;
          result.code = `if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("${id}");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

${result.code}

window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
`;
        }
        result.code += `
RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
  RefreshRuntime.registerExportsForReactRefresh("${id}", currentExports);
  import.meta.hot.accept((nextExports) => {
    if (!nextExports) return;
    const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("${id}", currentExports, nextExports);
    if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
  });
});
`;
        return { code: result.code, map: sourceMap };
      }
    },
    options.plugins ? {
      name: "vite:react-swc",
      apply: "build",
      enforce: "pre",
      // Run before esbuild
      config: (userConfig) => ({
        build: silenceUseClientWarning(userConfig)
      }),
      transform: (code, _id) => transformWithOptions(_id.split("?")[0], code, "esnext", options, {
        runtime: "automatic",
        importSource: options.jsxImportSource
      })
    } : {
      name: "vite:react-swc",
      apply: "build",
      config: (userConfig) => ({
        build: silenceUseClientWarning(userConfig),
        esbuild: {
          jsx: "automatic",
          jsxImportSource: options.jsxImportSource,
          tsconfigRaw: {
            compilerOptions: { useDefineForClassFields: true }
          }
        }
      })
    }
  ];
};
var transformWithOptions = async (id, code, target, options, reactConfig) => {
  const decorators = (options == null ? void 0 : options.tsDecorators) ?? false;
  const parser = options.parserConfig ? options.parserConfig(id) : id.endsWith(".tsx") ? { syntax: "typescript", tsx: true, decorators } : id.endsWith(".ts") || id.endsWith(".mts") ? { syntax: "typescript", tsx: false, decorators } : id.endsWith(".jsx") ? { syntax: "ecmascript", jsx: true } : id.endsWith(".mdx") ? (
    // JSX is required to trigger fast refresh transformations, even if MDX already transforms it
    { syntax: "ecmascript", jsx: true }
  ) : void 0;
  if (!parser) return;
  let result;
  try {
    const swcOptions = {
      filename: id,
      swcrc: false,
      configFile: false,
      sourceMaps: true,
      jsc: {
        target,
        parser,
        experimental: { plugins: options.plugins },
        transform: {
          useDefineForClassFields: true,
          react: reactConfig
        }
      }
    };
    if (options.useAtYourOwnRisk_mutateSwcOptions) {
      options.useAtYourOwnRisk_mutateSwcOptions(swcOptions);
    }
    result = await (0, import_core.transform)(code, swcOptions);
  } catch (e) {
    const message = e.message;
    const fileStartIndex = message.indexOf("\u256D\u2500[");
    if (fileStartIndex !== -1) {
      const match = message.slice(fileStartIndex).match(/:(\d+):(\d+)]/);
      if (match) {
        e.line = match[1];
        e.column = match[2];
      }
    }
    throw e;
  }
  return result;
};
var silenceUseClientWarning = (userConfig) => ({
  rollupOptions: {
    onwarn(warning, defaultHandler) {
      var _a, _b;
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
        return;
      }
      if (warning.code === "SOURCEMAP_ERROR" && warning.message.includes("resolve original location") && warning.pos === 0) {
        return;
      }
      if ((_b = (_a = userConfig.build) == null ? void 0 : _a.rollupOptions) == null ? void 0 : _b.onwarn) {
        userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
      } else {
        defaultHandler(warning);
      }
    }
  }
});
var src_default = react;

// <stdin>
module.exports = src_default;
module.exports.default = src_default;
