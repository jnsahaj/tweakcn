declare function addUniqueItem<T>(arr: T[], item: T): void;
declare function removeItem<T>(arr: T[], item: T): void;
declare function moveItem<T>([...arr]: T[], fromIndex: number, toIndex: number): T[];

type DevMessage = (check: boolean, message: string) => void;
declare let warning: DevMessage;
declare let invariant: DevMessage;

declare const MotionGlobalConfig: {
    skipAnimations: boolean;
    useManualTiming: boolean;
    WillChange?: any;
};

declare function memo<T extends any>(callback: () => T): () => T;

declare const noop: <T>(any: T) => T;

declare const progress: (from: number, to: number, value: number) => number;

type GenericHandler = (...args: any) => void;
declare class SubscriptionManager<Handler extends GenericHandler> {
    private subscriptions;
    add(handler: Handler): VoidFunction;
    notify(a?: Parameters<Handler>[0], b?: Parameters<Handler>[1], c?: Parameters<Handler>[2]): void;
    getSize(): number;
    clear(): void;
}

/**
 * Converts seconds to milliseconds
 *
 * @param seconds - Time in seconds.
 * @return milliseconds - Converted time in milliseconds.
 */
declare const secondsToMilliseconds: (seconds: number) => number;
declare const millisecondsToSeconds: (milliseconds: number) => number;

declare function velocityPerSecond(velocity: number, frameDuration: number): number;

declare function hasWarned(message: string): boolean;
declare function warnOnce(condition: boolean, message: string, element?: Element): void;

export { type DevMessage, MotionGlobalConfig, SubscriptionManager, addUniqueItem, hasWarned, invariant, memo, millisecondsToSeconds, moveItem, noop, progress, removeItem, secondsToMilliseconds, velocityPerSecond, warnOnce, warning };
