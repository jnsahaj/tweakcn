'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var motionDom = require('motion-dom');
var motionUtils = require('motion-utils');

/**
 * Creates a constant value over the lifecycle of a component.
 *
 * Even if `useMemo` is provided an empty array as its final argument, it doesn't offer
 * a guarantee that it won't re-run for performance reasons later on. By using `useConstant`
 * you can ensure that initialisers don't execute twice or more.
 */
function useConstant(init) {
    const ref = react.useRef(null);
    if (ref.current === null) {
        ref.current = init();
    }
    return ref.current;
}

function useUnmountEffect(callback) {
    return react.useEffect(() => () => callback(), []);
}

function animateElements(elementOrSelector, keyframes, options, scope) {
    const elements = motionDom.resolveElements(elementOrSelector, scope);
    const numElements = elements.length;
    motionUtils.invariant(Boolean(numElements), "No valid element provided.");
    const animations = [];
    for (let i = 0; i < numElements; i++) {
        const element = elements[i];
        const elementTransition = { ...options };
        /**
         * Resolve stagger function if provided.
         */
        if (typeof elementTransition.delay === "function") {
            elementTransition.delay = elementTransition.delay(i, numElements);
        }
        for (const valueName in keyframes) {
            const valueKeyframes = keyframes[valueName];
            const valueOptions = {
                ...motionDom.getValueTransition(elementTransition, valueName),
            };
            valueOptions.duration && (valueOptions.duration = motionUtils.secondsToMilliseconds(valueOptions.duration));
            valueOptions.delay && (valueOptions.delay = motionUtils.secondsToMilliseconds(valueOptions.delay));
            animations.push(new motionDom.NativeAnimation({
                element,
                name: valueName,
                keyframes: valueKeyframes,
                transition: valueOptions,
                allowFlatten: !elementTransition.type && !elementTransition.ease,
            }));
        }
    }
    return animations;
}

const createScopedWaapiAnimate = (scope) => {
    function scopedAnimate(elementOrSelector, keyframes, options) {
        return new motionDom.GroupAnimationWithThen(animateElements(elementOrSelector, keyframes, options, scope));
    }
    return scopedAnimate;
};

function useAnimateMini() {
    const scope = useConstant(() => ({
        current: null, // Will be hydrated by React
        animations: [],
    }));
    const animate = useConstant(() => createScopedWaapiAnimate(scope));
    useUnmountEffect(() => {
        scope.animations.forEach((animation) => animation.stop());
    });
    return [scope, animate];
}

exports.useAnimate = useAnimateMini;
