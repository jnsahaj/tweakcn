export type Logger = {
    _log: (level: 'log' | 'warn' | 'error', ...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    critical: (...args: any[]) => void;
    uninitializedWarning: (methodName: string) => void;
    createLogger: (prefix: string) => Logger;
};
export declare const logger: Logger;
export declare const createLogger: (prefix: string) => Logger;
