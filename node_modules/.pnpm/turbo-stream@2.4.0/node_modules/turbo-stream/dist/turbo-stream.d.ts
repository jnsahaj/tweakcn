import { type DecodePlugin, type EncodePlugin } from "./utils.js";
export type { DecodePlugin, EncodePlugin };
export declare function decode(readable: ReadableStream<Uint8Array>, options?: {
    plugins?: DecodePlugin[];
}): Promise<{
    done: Promise<undefined>;
    value: unknown;
}>;
export declare function encode(input: unknown, options?: {
    plugins?: EncodePlugin[];
    postPlugins?: EncodePlugin[];
    signal?: AbortSignal;
}): ReadableStream<Uint8Array>;
