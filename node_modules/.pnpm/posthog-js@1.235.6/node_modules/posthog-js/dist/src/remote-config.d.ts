import { PostHog } from './posthog-core';
import { RemoteConfig } from './types';
export declare class RemoteConfigLoader {
    private readonly instance;
    constructor(instance: PostHog);
    get remoteConfig(): RemoteConfig | undefined;
    private _loadRemoteConfigJs;
    private _loadRemoteConfigJSON;
    load(): void;
    private onRemoteConfig;
}
