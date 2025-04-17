import { frame } from 'motion-dom';
import { noop } from 'motion-utils';
import { useContext, useRef, useInsertionEffect } from 'react';
import { animateValue } from '../animation/animators/MainThreadAnimation.mjs';
import { MotionConfigContext } from '../context/MotionConfigContext.mjs';
import { useConstant } from '../utils/use-constant.mjs';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-effect.mjs';
import { useMotionValue } from './use-motion-value.mjs';
import { isMotionValue } from './utils/is-motion-value.mjs';

function useSpring(source, config = {}) {
    const { isStatic } = useContext(MotionConfigContext);
    const activeSpringAnimation = useRef(null);
    const initialValue = useConstant(() => isMotionValue(source) ? source.get() : source);
    const unit = useConstant(() => typeof initialValue === "string"
        ? initialValue.replace(/[\d.-]/g, "")
        : undefined);
    const value = useMotionValue(initialValue);
    const latestValue = useRef(initialValue);
    const latestSetter = useRef(noop);
    const startAnimation = () => {
        stopAnimation();
        activeSpringAnimation.current = animateValue({
            keyframes: [asNumber(value.get()), asNumber(latestValue.current)],
            velocity: value.getVelocity(),
            type: "spring",
            restDelta: 0.001,
            restSpeed: 0.01,
            ...config,
            onUpdate: latestSetter.current,
        });
    };
    const stopAnimation = () => {
        if (activeSpringAnimation.current) {
            activeSpringAnimation.current.stop();
        }
    };
    useInsertionEffect(() => {
        return value.attach((v, set) => {
            if (isStatic)
                return set(v);
            latestValue.current = v;
            latestSetter.current = (latest) => set(parseValue(latest, unit));
            frame.postRender(startAnimation);
            return value.get();
        }, stopAnimation);
    }, [JSON.stringify(config)]);
    useIsomorphicLayoutEffect(() => {
        if (isMotionValue(source)) {
            return source.on("change", (v) => value.set(parseValue(v, unit)));
        }
    }, [value, unit]);
    return value;
}
function parseValue(v, unit) {
    return unit ? v + unit : v;
}
function asNumber(v) {
    return typeof v === "number" ? v : parseFloat(v);
}

export { useSpring };
