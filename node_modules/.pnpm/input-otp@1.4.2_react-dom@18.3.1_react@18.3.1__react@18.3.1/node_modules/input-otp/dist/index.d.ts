import * as React$1 from 'react';

interface SlotProps {
    isActive: boolean;
    char: string | null;
    placeholderChar: string | null;
    hasFakeCaret: boolean;
}
interface RenderProps {
    slots: SlotProps[];
    isFocused: boolean;
    isHovering: boolean;
}
type OverrideProps<T, R> = Omit<T, keyof R> & R;
type OTPInputBaseProps = OverrideProps<React.InputHTMLAttributes<HTMLInputElement>, {
    value?: string;
    onChange?: (newValue: string) => unknown;
    maxLength: number;
    textAlign?: 'left' | 'center' | 'right';
    onComplete?: (...args: any[]) => unknown;
    pushPasswordManagerStrategy?: 'increase-width' | 'none';
    pasteTransformer?: (pasted: string) => string;
    containerClassName?: string;
    noScriptCSSFallback?: string | null;
}>;
type InputOTPRenderFn = (props: RenderProps) => React.ReactNode;
type OTPInputProps = OTPInputBaseProps & ({
    render: InputOTPRenderFn;
    children?: never;
} | {
    render?: never;
    children: React.ReactNode;
});

declare const OTPInputContext: React$1.Context<RenderProps>;
declare const OTPInput: React$1.ForwardRefExoticComponent<OTPInputProps & React$1.RefAttributes<HTMLInputElement>>;

declare const REGEXP_ONLY_DIGITS = "^\\d+$";
declare const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
declare const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";

export { OTPInput, OTPInputContext, type OTPInputProps, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS, type RenderProps, type SlotProps };
