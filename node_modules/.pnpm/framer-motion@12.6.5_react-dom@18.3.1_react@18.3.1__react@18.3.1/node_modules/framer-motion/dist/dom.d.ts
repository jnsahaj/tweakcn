import * as motion_dom from 'motion-dom';
import { MotionValue, UnresolvedValueKeyframe, Transition, ElementOrSelector, DOMKeyframesDefinition, AnimationOptions, AnimationPlaybackOptions, Easing, AnimationScope, AnimationPlaybackControlsWithThen, ValueAnimationTransition, EasingFunction, ProgressTimeline, AnimationPlaybackControls, EasingModifier, ValueAnimationOptions, KeyframeGenerator, DynamicOption } from 'motion-dom';
export * from 'motion-dom';
export { BezierDefinition, Easing, EasingDefinition, EasingFunction, EasingModifier, MotionValue, cancelFrame, cancelSync, frame, frameData, hover, isDragActive, motionValue, press, sync, time } from 'motion-dom';
export { invariant, noop, progress } from 'motion-utils';

interface Point {
    x: number;
    y: number;
}

type GenericKeyframesTarget<V> = V[] | Array<null | V>;

type ObjectTarget<O> = {
    [K in keyof O]?: O[K] | GenericKeyframesTarget<O[K]>;
};
type SequenceTime = number | "<" | `+${number}` | `-${number}` | `${string}`;
type SequenceLabel = string;
interface SequenceLabelWithTime {
    name: SequenceLabel;
    at: SequenceTime;
}
interface At {
    at?: SequenceTime;
}
type MotionValueSegment = [
    MotionValue,
    UnresolvedValueKeyframe | UnresolvedValueKeyframe[]
];
type MotionValueSegmentWithTransition = [
    MotionValue,
    UnresolvedValueKeyframe | UnresolvedValueKeyframe[],
    Transition & At
];
type DOMSegment = [ElementOrSelector, DOMKeyframesDefinition];
type DOMSegmentWithTransition = [
    ElementOrSelector,
    DOMKeyframesDefinition,
    AnimationOptions & At
];
type ObjectSegment<O extends {} = {}> = [O, ObjectTarget<O>];
type ObjectSegmentWithTransition<O extends {} = {}> = [
    O,
    ObjectTarget<O>,
    AnimationOptions & At
];
type Segment = ObjectSegment | ObjectSegmentWithTransition | SequenceLabel | SequenceLabelWithTime | MotionValueSegment | MotionValueSegmentWithTransition | DOMSegment | DOMSegmentWithTransition;
type AnimationSequence = Segment[];
interface SequenceOptions extends AnimationPlaybackOptions {
    delay?: number;
    duration?: number;
    defaultTransition?: Transition;
}
interface AbsoluteKeyframe {
    value: string | number | null;
    at: number;
    easing?: Easing;
}
type ValueSequence = AbsoluteKeyframe[];
interface SequenceMap {
    [key: string]: ValueSequence;
}
type ResolvedAnimationDefinition = {
    keyframes: {
        [key: string]: UnresolvedValueKeyframe[];
    };
    transition: {
        [key: string]: Transition;
    };
};
type ResolvedAnimationDefinitions = Map<Element | MotionValue, ResolvedAnimationDefinition>;

/**
 * Creates an animation function that is optionally scoped
 * to a specific element.
 */
declare function createScopedAnimate(scope?: AnimationScope): {
    (sequence: AnimationSequence, options?: SequenceOptions): AnimationPlaybackControlsWithThen;
    (value: string | MotionValue<string>, keyframes: string | GenericKeyframesTarget<string>, options?: ValueAnimationTransition<string>): AnimationPlaybackControlsWithThen;
    (value: number | MotionValue<number>, keyframes: number | GenericKeyframesTarget<number>, options?: ValueAnimationTransition<number>): AnimationPlaybackControlsWithThen;
    <V>(value: V | MotionValue<V>, keyframes: V | GenericKeyframesTarget<V>, options?: ValueAnimationTransition<V>): AnimationPlaybackControlsWithThen;
    (element: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: AnimationOptions): AnimationPlaybackControlsWithThen;
    <O extends {}>(object: O | O[], keyframes: ObjectTarget<O>, options?: AnimationOptions): AnimationPlaybackControlsWithThen;
};
declare const animate: {
    (sequence: AnimationSequence, options?: SequenceOptions): AnimationPlaybackControlsWithThen;
    (value: string | MotionValue<string>, keyframes: string | GenericKeyframesTarget<string>, options?: ValueAnimationTransition<string>): AnimationPlaybackControlsWithThen;
    (value: number | MotionValue<number>, keyframes: number | GenericKeyframesTarget<number>, options?: ValueAnimationTransition<number>): AnimationPlaybackControlsWithThen;
    <V>(value: V | MotionValue<V>, keyframes: V | GenericKeyframesTarget<V>, options?: ValueAnimationTransition<V>): AnimationPlaybackControlsWithThen;
    (element: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: AnimationOptions): AnimationPlaybackControlsWithThen;
    <O extends {}>(object: O | O[], keyframes: ObjectTarget<O>, options?: AnimationOptions): AnimationPlaybackControlsWithThen;
};

declare const animateMini: (elementOrSelector: ElementOrSelector, keyframes: DOMKeyframesDefinition, options?: AnimationOptions) => AnimationPlaybackControlsWithThen;

interface ScrollOptions {
    source?: HTMLElement;
    container?: HTMLElement;
    target?: Element;
    axis?: "x" | "y";
    offset?: ScrollOffset;
}
type OnScrollProgress = (progress: number) => void;
type OnScrollWithInfo = (progress: number, info: ScrollInfo) => void;
type OnScroll = OnScrollProgress | OnScrollWithInfo;
interface AxisScrollInfo {
    current: number;
    offset: number[];
    progress: number;
    scrollLength: number;
    velocity: number;
    targetOffset: number;
    targetLength: number;
    containerLength: number;
    interpolatorOffsets?: number[];
    interpolate?: EasingFunction;
}
interface ScrollInfo {
    time: number;
    x: AxisScrollInfo;
    y: AxisScrollInfo;
}
type OnScrollInfo = (info: ScrollInfo) => void;
type SupportedEdgeUnit = "px" | "vw" | "vh" | "%";
type EdgeUnit = `${number}${SupportedEdgeUnit}`;
type NamedEdges = "start" | "end" | "center";
type EdgeString = NamedEdges | EdgeUnit | `${number}`;
type Edge = EdgeString | number;
type ProgressIntersection = [number, number];
type Intersection = `${Edge} ${Edge}`;
type ScrollOffset = Array<Edge | Intersection | ProgressIntersection>;
interface ScrollInfoOptions {
    container?: HTMLElement;
    target?: Element;
    axis?: "x" | "y";
    offset?: ScrollOffset;
}

declare global {
    interface Window {
        ScrollTimeline: ScrollTimeline;
    }
}
declare class ScrollTimeline implements ProgressTimeline {
    constructor(options: ScrollOptions);
    currentTime: null | {
        value: number;
    };
    cancel?: VoidFunction;
}
declare function scroll(onScroll: OnScroll | AnimationPlaybackControls, { axis, ...options }?: ScrollOptions): VoidFunction;

declare function scrollInfo(onScroll: OnScrollInfo, { container, ...options }?: ScrollInfoOptions): () => void;

type ViewChangeHandler = (entry: IntersectionObserverEntry) => void;
type MarginValue = `${number}${"px" | "%"}`;
type MarginType = MarginValue | `${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;
interface InViewOptions {
    root?: Element | Document;
    margin?: MarginType;
    amount?: "some" | "all" | number;
}
declare function inView(elementOrSelector: ElementOrSelector, onStart: (element: Element, entry: IntersectionObserverEntry) => void | ViewChangeHandler, { root, margin: rootMargin, amount }?: InViewOptions): VoidFunction;

declare const anticipate: (p: number) => number;

declare const backOut: (t: number) => number;
declare const backIn: motion_dom.EasingFunction;
declare const backInOut: motion_dom.EasingFunction;

declare const circIn: EasingFunction;
declare const circOut: EasingFunction;
declare const circInOut: EasingFunction;

declare function cubicBezier(mX1: number, mY1: number, mX2: number, mY2: number): (t: number) => number;

declare const easeIn: (t: number) => number;
declare const easeOut: (t: number) => number;
declare const easeInOut: (t: number) => number;

declare const mirrorEasing: EasingModifier;

declare const reverseEasing: EasingModifier;

type Direction = "start" | "end";
declare function steps(numSteps: number, direction?: Direction): EasingFunction;

declare function inertia({ keyframes, velocity, power, timeConstant, bounceDamping, bounceStiffness, modifyTarget, min, max, restDelta, restSpeed, }: ValueAnimationOptions<number>): KeyframeGenerator<number>;

declare function keyframes<T extends string | number>({ duration, keyframes: keyframeValues, times, ease, }: ValueAnimationOptions<T>): KeyframeGenerator<T>;

declare function spring(optionsOrVisualDuration?: ValueAnimationOptions<number> | number, bounce?: number): KeyframeGenerator<number>;
declare namespace spring {
    var applyToOptions: (options: Transition) => Transition;
}

type StaggerOrigin = "first" | "last" | "center" | number;
type StaggerOptions = {
    startDelay?: number;
    from?: StaggerOrigin;
    ease?: Easing;
};
declare function stagger(duration?: number, { startDelay, from, ease }?: StaggerOptions): DynamicOption<number>;

declare const clamp: (min: number, max: number, v: number) => number;

type DelayedFunction = (overshoot: number) => void;
declare function delayInSeconds(callback: DelayedFunction, timeout: number): () => void;

declare const distance: (a: number, b: number) => number;
declare function distance2D(a: Point, b: Point): number;

type Mix<T> = (v: number) => T;
type MixerFactory<T> = (from: T, to: T) => Mix<T>;
interface InterpolateOptions<T> {
    clamp?: boolean;
    ease?: EasingFunction | EasingFunction[];
    mixer?: MixerFactory<T>;
}
/**
 * Create a function that maps from a numerical input array to a generic output array.
 *
 * Accepts:
 *   - Numbers
 *   - Colors (hex, hsl, hsla, rgb, rgba)
 *   - Complex (combinations of one or more numbers or strings)
 *
 * ```jsx
 * const mixColor = interpolate([0, 1], ['#fff', '#000'])
 *
 * mixColor(0.5) // 'rgba(128, 128, 128, 1)'
 * ```
 *
 * TODO Revist this approach once we've moved to data models for values,
 * probably not needed to pregenerate mixer functions.
 *
 * @public
 */
declare function interpolate<T>(input: number[], output: T[], { clamp: isClamp, ease, mixer }?: InterpolateOptions<T>): (v: number) => T;

type Mixer<T> = (p: number) => T;

declare function mix<T>(from: T, to: T): Mixer<T>;
declare function mix(from: number, to: number, p: number): number;

declare const pipe: (...transformers: Function[]) => Function;

/**
 * @public
 */
interface TransformOptions<T> {
    /**
     * Clamp values to within the given range. Defaults to `true`
     *
     * @public
     */
    clamp?: boolean;
    /**
     * Easing functions to use on the interpolations between each value in the input and output ranges.
     *
     * If provided as an array, the array must be one item shorter than the input and output ranges, as the easings apply to the transition **between** each.
     *
     * @public
     */
    ease?: EasingFunction | EasingFunction[];
    /**
     * Provide a function that can interpolate between any two values in the provided range.
     *
     * @public
     */
    mixer?: (from: T, to: T) => (v: number) => any;
}
/**
 * Transforms numbers into other values by mapping them from an input range to an output range.
 * Returns the type of the input provided.
 *
 * @remarks
 *
 * Given an input range of `[0, 200]` and an output range of
 * `[0, 1]`, this function will return a value between `0` and `1`.
 * The input range must be a linear series of numbers. The output range
 * can be any supported value type, such as numbers, colors, shadows, arrays, objects and more.
 * Every value in the output range must be of the same type and in the same format.
 *
 * ```jsx
 * import * as React from "react"
 * import { transform } from "framer-motion"
 *
 * export function MyComponent() {
 *    const inputRange = [0, 200]
 *    const outputRange = [0, 1]
 *    const output = transform(100, inputRange, outputRange)
 *
 *    // Returns 0.5
 *    return <div>{output}</div>
 * }
 * ```
 *
 * @param inputValue - A number to transform between the input and output ranges.
 * @param inputRange - A linear series of numbers (either all increasing or decreasing).
 * @param outputRange - A series of numbers, colors, strings, or arrays/objects of those. Must be the same length as `inputRange`.
 * @param options - Clamp: Clamp values to within the given range. Defaults to `true`.
 *
 * @public
 */
declare function transform<T>(inputValue: number, inputRange: number[], outputRange: T[], options?: TransformOptions<T>): T;
/**
 *
 * Transforms numbers into other values by mapping them from an input range to an output range.
 *
 * Given an input range of `[0, 200]` and an output range of
 * `[0, 1]`, this function will return a value between `0` and `1`.
 * The input range must be a linear series of numbers. The output range
 * can be any supported value type, such as numbers, colors, shadows, arrays, objects and more.
 * Every value in the output range must be of the same type and in the same format.
 *
 * ```jsx
 * import * as React from "react"
 * import { Frame, transform } from "framer"
 *
 * export function MyComponent() {
 *     const inputRange = [-200, -100, 100, 200]
 *     const outputRange = [0, 1, 1, 0]
 *     const convertRange = transform(inputRange, outputRange)
 *     const output = convertRange(-150)
 *
 *     // Returns 0.5
 *     return <div>{output}</div>
 * }
 *
 * ```
 *
 * @param inputRange - A linear series of numbers (either all increasing or decreasing).
 * @param outputRange - A series of numbers, colors or strings. Must be the same length as `inputRange`.
 * @param options - Clamp: clamp values to within the given range. Defaults to `true`.
 *
 * @public
 */
declare function transform<T>(inputRange: number[], outputRange: T[], options?: TransformOptions<T>): (inputValue: number) => T;

declare const wrap: (min: number, max: number, v: number) => number;

export { type AbsoluteKeyframe, type AnimationSequence, type At, type DOMSegment, type DOMSegmentWithTransition, type DelayedFunction, type Direction, type InterpolateOptions, type MixerFactory, type MotionValueSegment, type MotionValueSegmentWithTransition, type ObjectSegment, type ObjectSegmentWithTransition, type ObjectTarget, type ResolvedAnimationDefinition, type ResolvedAnimationDefinitions, type Segment, type SequenceLabel, type SequenceLabelWithTime, type SequenceMap, type SequenceOptions, type SequenceTime, type ValueSequence, animate, animateMini, anticipate, backIn, backInOut, backOut, circIn, circInOut, circOut, clamp, createScopedAnimate, cubicBezier, delayInSeconds as delay, distance, distance2D, easeIn, easeInOut, easeOut, inView, inertia, interpolate, keyframes, mirrorEasing, mix, pipe, reverseEasing, scroll, scrollInfo, spring, stagger, steps, transform, wrap };
