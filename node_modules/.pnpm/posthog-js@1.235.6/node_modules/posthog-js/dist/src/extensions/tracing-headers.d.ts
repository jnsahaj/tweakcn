import { PostHog } from '../posthog-core';
export declare class TracingHeaders {
    private readonly instance;
    private _restoreXHRPatch;
    private _restoreFetchPatch;
    constructor(instance: PostHog);
    private _loadScript;
    startIfEnabledOrStop(): void;
    private _startCapturing;
}
