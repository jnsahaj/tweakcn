import { Candidate, Variant } from './candidate';
import { compileAstNodes } from './compile';
import { ClassEntry, VariantEntry } from './intellisense';
import { Theme } from './theme';
import { Utilities } from './utilities';
import { Variants } from './variants';
import { Polyfills, Features } from 'tailwindcss';
export { Features, Polyfills } from 'tailwindcss';

declare const DEBUG: boolean;

declare const env_DEBUG: typeof DEBUG;
declare namespace env {
  export { env_DEBUG as DEBUG };
}

type DesignSystem = {
    theme: Theme;
    utilities: Utilities;
    variants: Variants;
    invalidCandidates: Set<string>;
    important: boolean;
    getClassOrder(classes: string[]): [string, bigint | null][];
    getClassList(): ClassEntry[];
    getVariants(): VariantEntry[];
    parseCandidate(candidate: string): Readonly<Candidate>[];
    parseVariant(variant: string): Readonly<Variant> | null;
    compileAstNodes(candidate: Candidate): ReturnType<typeof compileAstNodes>;
    getVariantOrder(): Map<Variant, number>;
    resolveThemeValue(path: string, forceInline?: boolean): string | undefined;
    trackUsedVariables(raw: string): void;
    candidatesToCss(classes: string[]): (string | null)[];
};

type StyleRule = {
    kind: 'rule';
    selector: string;
    nodes: AstNode[];
};
type AtRule = {
    kind: 'at-rule';
    name: string;
    params: string;
    nodes: AstNode[];
};
type Declaration = {
    kind: 'declaration';
    property: string;
    value: string | undefined;
    important: boolean;
};
type Comment = {
    kind: 'comment';
    value: string;
};
type Context = {
    kind: 'context';
    context: Record<string, string | boolean>;
    nodes: AstNode[];
};
type AtRoot = {
    kind: 'at-root';
    nodes: AstNode[];
};
type AstNode = StyleRule | AtRule | Declaration | Comment | Context | AtRoot;

type Resolver = (id: string, base: string) => Promise<string | false | undefined>;
interface CompileOptions {
    base: string;
    onDependency: (path: string) => void;
    shouldRewriteUrls?: boolean;
    polyfills?: Polyfills;
    customCssResolver?: Resolver;
    customJsResolver?: Resolver;
}
declare function compileAst(ast: AstNode[], options: CompileOptions): Promise<{
    sources: {
        base: string;
        pattern: string;
        negated: boolean;
    }[];
    root: "none" | {
        base: string;
        pattern: string;
    } | null;
    features: Features;
    build(candidates: string[]): AstNode[];
}>;
declare function compile(css: string, options: CompileOptions): Promise<{
    sources: {
        base: string;
        pattern: string;
        negated: boolean;
    }[];
    root: "none" | {
        base: string;
        pattern: string;
    } | null;
    features: Features;
    build(candidates: string[]): string;
}>;
declare function __unstable__loadDesignSystem(css: string, { base }: {
    base: string;
}): Promise<DesignSystem>;
declare function loadModule(id: string, base: string, onDependency: (path: string) => void, customJsResolver?: Resolver): Promise<{
    base: string;
    module: any;
}>;

declare class Instrumentation implements Disposable {
    #private;
    private defaultFlush;
    constructor(defaultFlush?: (message: string) => undefined);
    hit(label: string): void;
    start(label: string): void;
    end(label: string): void;
    reset(): void;
    report(flush?: (message: string) => undefined): void;
    [Symbol.dispose](): void;
}

declare function normalizePath(originalPath: string): string;

declare function optimize(input: string, { file, minify }?: {
    file?: string;
    minify?: boolean;
}): string;

export { type CompileOptions, Instrumentation, type Resolver, __unstable__loadDesignSystem, compile, compileAst, env, loadModule, normalizePath, optimize };
