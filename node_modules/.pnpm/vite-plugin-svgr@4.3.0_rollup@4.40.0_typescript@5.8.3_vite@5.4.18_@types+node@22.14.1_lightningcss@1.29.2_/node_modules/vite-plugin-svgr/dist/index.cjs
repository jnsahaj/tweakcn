"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = vitePluginSvgr;
const pluginutils_1 = require("@rollup/pluginutils");
const fs_1 = __importDefault(require("fs"));
const vite_1 = require("vite");
function vitePluginSvgr({ svgrOptions, esbuildOptions, include = "**/*.svg?react", exclude, } = {}) {
    const filter = (0, pluginutils_1.createFilter)(include, exclude);
    const postfixRE = /[?#].*$/s;
    return {
        name: "vite-plugin-svgr",
        enforce: "pre", // to override `vite:asset`'s behavior
        async load(id) {
            if (filter(id)) {
                const { transform } = await Promise.resolve().then(() => __importStar(require("@svgr/core")));
                const { default: jsx } = await Promise.resolve().then(() => __importStar(require("@svgr/plugin-jsx")));
                const filePath = id.replace(postfixRE, "");
                const svgCode = await fs_1.default.promises.readFile(filePath, "utf8");
                const componentCode = await transform(svgCode, svgrOptions, {
                    filePath,
                    caller: {
                        defaultPlugins: [jsx],
                    },
                });
                const res = await (0, vite_1.transformWithEsbuild)(componentCode, id, {
                    loader: "jsx",
                    ...esbuildOptions,
                });
                return {
                    code: res.code,
                    map: null, // TODO:
                };
            }
        },
    };
}
