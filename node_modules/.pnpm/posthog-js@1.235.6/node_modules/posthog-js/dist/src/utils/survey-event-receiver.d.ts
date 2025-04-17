import { Survey } from '../posthog-surveys-types';
import { CaptureResult } from '../types';
import { ActionMatcher } from '../extensions/surveys/action-matcher';
import { PostHog } from '../posthog-core';
export declare class SurveyEventReceiver {
    private readonly eventToSurveys;
    private readonly actionToSurveys;
    private actionMatcher?;
    private readonly instance?;
    private static SURVEY_SHOWN_EVENT_NAME;
    constructor(instance: PostHog);
    register(surveys: Survey[]): void;
    private setupActionBasedSurveys;
    private setupEventBasedSurveys;
    onEvent(event: string, eventPayload?: CaptureResult): void;
    onAction(actionName: string): void;
    private _updateActivatedSurveys;
    getSurveys(): string[];
    getEventToSurveys(): Map<string, string[]>;
    _getActionMatcher(): ActionMatcher | null | undefined;
}
