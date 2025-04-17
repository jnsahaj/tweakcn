import type { TSESLint } from '@typescript-eslint/utils';
export type Options = [
    {
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing?: boolean;
        ignoreBooleanCoercion?: boolean;
        ignoreConditionalTests?: boolean;
        ignoreIfStatements?: boolean;
        ignoreMixedLogicalExpressions?: boolean;
        ignorePrimitives?: {
            bigint?: boolean;
            boolean?: boolean;
            number?: boolean;
            string?: boolean;
        } | true;
        ignoreTernaryTests?: boolean;
    }
];
export type MessageIds = 'noStrictNullCheck' | 'preferNullishOverAssignment' | 'preferNullishOverOr' | 'preferNullishOverTernary' | 'suggestNullish';
declare const _default: TSESLint.RuleModule<MessageIds, Options, import("../../rules").ESLintPluginDocs, TSESLint.RuleListener>;
export default _default;
//# sourceMappingURL=prefer-nullish-coalescing.d.ts.map