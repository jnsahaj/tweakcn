import { PostHog } from './posthog-core';
import { Properties } from './types';
export declare class PostHogExceptions {
    private readonly instance;
    constructor(instance: PostHog);
    /**
     * :TRICKY: Make sure we batch these requests
     */
    sendExceptionEvent(properties: Properties): void;
}
