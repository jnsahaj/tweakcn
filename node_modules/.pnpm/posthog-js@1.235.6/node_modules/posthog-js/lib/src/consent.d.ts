import { PostHog } from './posthog-core';
export declare enum ConsentStatus {
    PENDING = -1,
    DENIED = 0,
    GRANTED = 1
}
/**
 * ConsentManager provides tools for managing user consent as configured by the application.
 */
export declare class ConsentManager {
    private instance;
    private _storage?;
    constructor(instance: PostHog);
    private get config();
    get consent(): ConsentStatus;
    isOptedOut(): boolean;
    isOptedIn(): boolean;
    optInOut(isOptedIn: boolean): void;
    reset(): void;
    private get storageKey();
    private get storedConsent();
    private get storage();
    private getDnt;
}
