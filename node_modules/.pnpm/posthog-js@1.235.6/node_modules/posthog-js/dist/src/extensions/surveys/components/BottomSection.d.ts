import { SurveyAppearance } from '../../../posthog-surveys-types';
export declare function BottomSection({ text, submitDisabled, appearance, onSubmit, link, onPreviewSubmit, }: {
    text: string;
    submitDisabled: boolean;
    appearance: SurveyAppearance;
    onSubmit: () => void;
    link?: string | null;
    onPreviewSubmit?: () => void;
}): JSX.Element;
