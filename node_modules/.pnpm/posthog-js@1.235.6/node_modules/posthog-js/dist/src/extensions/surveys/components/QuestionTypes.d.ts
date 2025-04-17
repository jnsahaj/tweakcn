import { BasicSurveyQuestion, LinkSurveyQuestion, MultipleSurveyQuestion, RatingSurveyQuestion, SurveyAppearance } from '../../../posthog-surveys-types';
interface CommonProps {
    forceDisableHtml: boolean;
    appearance: SurveyAppearance;
    onSubmit: (res: string | string[] | number | null) => void;
    onPreviewSubmit: (res: string | string[] | number | null) => void;
}
export declare function OpenTextQuestion({ question, forceDisableHtml, appearance, onSubmit, onPreviewSubmit, }: CommonProps & {
    question: BasicSurveyQuestion;
}): JSX.Element;
export declare function LinkQuestion({ question, forceDisableHtml, appearance, onSubmit, onPreviewSubmit, }: CommonProps & {
    question: LinkSurveyQuestion;
}): JSX.Element;
export declare function RatingQuestion({ question, forceDisableHtml, displayQuestionIndex, appearance, onSubmit, onPreviewSubmit, }: CommonProps & {
    question: RatingSurveyQuestion;
    displayQuestionIndex: number;
}): JSX.Element;
export declare function RatingButton({ num, active, displayQuestionIndex, appearance, setActiveNumber, }: {
    num: number;
    active: boolean;
    displayQuestionIndex: number;
    appearance: SurveyAppearance;
    setActiveNumber: (num: number) => void;
}): JSX.Element;
export declare function MultipleChoiceQuestion({ question, forceDisableHtml, displayQuestionIndex, appearance, onSubmit, onPreviewSubmit, }: CommonProps & {
    question: MultipleSurveyQuestion;
    displayQuestionIndex: number;
}): JSX.Element;
export {};
