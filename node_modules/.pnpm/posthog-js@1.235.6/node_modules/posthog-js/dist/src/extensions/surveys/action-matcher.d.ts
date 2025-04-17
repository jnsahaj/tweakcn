import { PostHog } from '../../posthog-core';
import { SurveyActionType } from '../../posthog-surveys-types';
import { CaptureResult } from '../../types';
export declare class ActionMatcher {
    private readonly actionRegistry?;
    private readonly instance?;
    private readonly actionEvents;
    private _debugEventEmitter;
    constructor(instance?: PostHog);
    init(): void;
    register(actions: SurveyActionType[]): void;
    on(eventName: string, eventPayload?: CaptureResult): void;
    _addActionHook(callback: (actionName: string, eventPayload?: any) => void): void;
    private checkAction;
    onAction(event: 'actionCaptured', cb: (...args: any[]) => void): () => void;
    private checkStep;
    private checkStepEvent;
    private checkStepUrl;
    private static matchString;
    private static escapeStringRegexp;
    private checkStepElement;
    private getElementsList;
}
