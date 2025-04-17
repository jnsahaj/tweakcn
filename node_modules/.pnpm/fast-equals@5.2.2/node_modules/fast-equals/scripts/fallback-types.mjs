import fs from 'node:fs';
import path from 'node:path';

const METHODS = `
/**
 * Whether the values passed are strictly equal or both NaN.
 */
export declare const sameValueZeroEqual: <A, B>(a: A, b: B) => boolean;

/**
 * Whether the items passed are deeply-equal in value.
 */
export declare const deepEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Whether the items passed are deeply-equal in value based on strict comparison.
 */
export declare const strictDeepEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Whether the items passed are deeply-equal in value, including circular references.
 */
export declare const circularDeepEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Whether the items passed are deeply-equal in value, including circular references,
 * based on strict comparison.
 */
export declare const strictCircularDeepEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Whether the items passed are shallowly-equal in value.
 */
export declare const shallowEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Whether the items passed are shallowly-equal in value based on strict comparison
 */
export declare const strictShallowEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Whether the items passed are shallowly-equal in value, including circular references.
 */
export declare const circularShallowEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Whether the items passed are shallowly-equal in value, including circular references,
 * based on strict comparison.
 */
export declare const strictCircularShallowEqual: <A, B>(a: A, b: B) => boolean;
/**
 * Create a custom equality comparison method.
 *
 * This can be done to create very targeted comparisons in extreme hot-path scenarios
 * where the standard methods are not performant enough, but can also be used to provide
 * support for legacy environments that cannot polyfill for modern features expected by
 * \`fast-equals\`, such as \`WeakMap\` or \`RegExp.prototype.flags\`.
 */
export declare function createCustomEqual<Meta = undefined>(
  options?: CustomEqualCreatorOptions<Meta>,
): <A, B>(a: A, b: B) => boolean;
`;

const INTERNAL_TYPES = fs.readFileSync(
  path.join(import.meta.dirname, '..', 'src', 'internalTypes.ts'),
);

const OUTPUT = `${INTERNAL_TYPES}\n${METHODS}`.trim();
const OUTPUT_DESTINATION = path.join(import.meta.dirname, '..', 'index.d.ts');

fs.writeFileSync(OUTPUT_DESTINATION, OUTPUT, 'utf-8');
