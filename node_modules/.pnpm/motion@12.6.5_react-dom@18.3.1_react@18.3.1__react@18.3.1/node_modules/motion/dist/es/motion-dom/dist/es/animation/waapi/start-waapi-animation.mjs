import { activeAnimations } from '../../stats/animation-count.mjs';
import { statsBuffer } from '../../stats/buffer.mjs';
import { mapEasingToNativeEasing } from './easing/map-easing.mjs';

function startWaapiAnimation(element, valueName, keyframes, { delay = 0, duration = 300, repeat = 0, repeatType = "loop", ease = "easeInOut", times, } = {}, pseudoElement = undefined) {
    const keyframeOptions = {
        [valueName]: keyframes,
    };
    if (times)
        keyframeOptions.offset = times;
    const easing = mapEasingToNativeEasing(ease, duration);
    /**
     * If this is an easing array, apply to keyframes, not animation as a whole
     */
    if (Array.isArray(easing))
        keyframeOptions.easing = easing;
    if (statsBuffer.value) {
        activeAnimations.waapi++;
    }
    const animation = element.animate(keyframeOptions, {
        delay,
        duration,
        easing: !Array.isArray(easing) ? easing : "linear",
        fill: "both",
        iterations: repeat + 1,
        direction: repeatType === "reverse" ? "alternate" : "normal",
        pseudoElement,
    });
    if (statsBuffer.value) {
        animation.finished.finally(() => {
            activeAnimations.waapi--;
        });
    }
    return animation;
}

export { startWaapiAnimation };
