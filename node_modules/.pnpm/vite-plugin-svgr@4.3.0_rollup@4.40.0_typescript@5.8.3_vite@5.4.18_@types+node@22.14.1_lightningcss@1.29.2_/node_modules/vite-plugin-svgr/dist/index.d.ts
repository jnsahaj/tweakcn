import { FilterPattern } from "@rollup/pluginutils";
import type { Config } from "@svgr/core";
import type { Plugin } from "vite";
import { transformWithEsbuild } from "vite";
export interface VitePluginSvgrOptions {
    svgrOptions?: Config;
    esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
    exclude?: FilterPattern;
    include?: FilterPattern;
}
export default function vitePluginSvgr({ svgrOptions, esbuildOptions, include, exclude, }?: VitePluginSvgrOptions): Plugin;
