import { PostHog } from './posthog-core';
import { WebExperimentsCallback, WebExperimentUrlMatchType } from './web-experiments-types';
export declare const webExperimentUrlValidationMap: Record<WebExperimentUrlMatchType, (conditionsUrl: string, location: Location) => boolean>;
export declare class WebExperiments {
    private instance;
    private _flagToExperiments?;
    constructor(instance: PostHog);
    onFeatureFlags(flags: string[]): void;
    previewWebExperiment(): void;
    loadIfEnabled(): void;
    getWebExperimentsAndEvaluateDisplayLogic: (forceReload?: boolean) => void;
    getWebExperiments(callback: WebExperimentsCallback, forceReload: boolean, previewing?: boolean): void;
    private showPreviewWebExperiment;
    private static matchesTestVariant;
    private static matchUrlConditions;
    static getWindowLocation(): Location | undefined;
    private static matchUTMConditions;
    private static logInfo;
    private applyTransforms;
    _is_bot(): boolean | undefined;
}
