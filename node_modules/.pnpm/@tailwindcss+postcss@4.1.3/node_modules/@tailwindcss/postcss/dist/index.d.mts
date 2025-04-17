import { PluginCreator } from 'postcss';

type PluginOptions = {
    base?: string;
    optimize?: boolean | {
        minify?: boolean;
    };
};
declare const _default: PluginCreator<PluginOptions>;

export { type PluginOptions, _default as default };
