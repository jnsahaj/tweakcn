export declare const HOLE = -1;
export declare const NAN = -2;
export declare const NEGATIVE_INFINITY = -3;
export declare const NEGATIVE_ZERO = -4;
export declare const NULL = -5;
export declare const POSITIVE_INFINITY = -6;
export declare const UNDEFINED = -7;
export declare const TYPE_BIGINT = "B";
export declare const TYPE_DATE = "D";
export declare const TYPE_ERROR = "E";
export declare const TYPE_MAP = "M";
export declare const TYPE_NULL_OBJECT = "N";
export declare const TYPE_PROMISE = "P";
export declare const TYPE_REGEXP = "R";
export declare const TYPE_SET = "S";
export declare const TYPE_SYMBOL = "Y";
export declare const TYPE_URL = "U";
export declare const TYPE_PREVIOUS_RESOLVED = "Z";
export type DecodePlugin = (type: string, ...data: unknown[]) => {
    value: unknown;
} | false | null | undefined;
export type EncodePlugin = (value: unknown) => [string, ...unknown[]] | false | null | undefined;
export interface ThisDecode {
    values: unknown[];
    hydrated: unknown[];
    deferred: Record<number, Deferred<unknown>>;
    plugins?: DecodePlugin[];
}
export interface ThisEncode {
    index: number;
    indices: Map<unknown, number>;
    stringified: string[];
    deferred: Record<number, Promise<unknown>>;
    plugins?: EncodePlugin[];
    postPlugins?: EncodePlugin[];
    signal?: AbortSignal;
}
export declare class Deferred<T = unknown> {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: unknown) => void;
    constructor();
}
export declare function createLineSplittingTransform(): TransformStream<any, any>;
