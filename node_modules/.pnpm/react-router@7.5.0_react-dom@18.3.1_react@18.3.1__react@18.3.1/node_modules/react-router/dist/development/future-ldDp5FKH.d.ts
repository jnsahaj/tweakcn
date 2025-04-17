/**
 * An object of unknown type for route loaders and actions provided by the
 * server's `getLoadContext()` function.  This is defined as an empty interface
 * specifically so apps can leverage declaration merging to augment this type
 * globally: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
interface AppLoadContext {
    [key: string]: unknown;
}

/**
 * An augmentable interface users can modify in their app-code to opt into
 * future-flag-specific types
 */
interface Future {
}
type MiddlewareEnabled = Future extends {
    unstable_middleware: infer T extends boolean;
} ? T : false;

export type { AppLoadContext as A, Future as F, MiddlewareEnabled as M };
