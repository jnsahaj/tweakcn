import { PostHog } from './posthog-core';
export interface ScrollContext {
    maxScrollHeight?: number;
    maxScrollY?: number;
    lastScrollY?: number;
    maxContentHeight?: number;
    maxContentY?: number;
    lastContentY?: number;
}
export declare class ScrollManager {
    private instance;
    private context;
    constructor(instance: PostHog);
    getContext(): ScrollContext | undefined;
    resetContext(): ScrollContext | undefined;
    private _updateScrollData;
    startMeasuringScrollPosition(): void;
    scrollElement(): Element | undefined;
    scrollY(): number;
    scrollX(): number;
}
