import { createRendererMotionComponent } from '../../motion/index.mjs';
import { createUseRender } from '../dom/use-render.mjs';
import { isSVGComponent } from '../dom/utils/is-svg-component.mjs';
import { htmlMotionConfig } from '../html/config-motion.mjs';
import { svgMotionConfig } from '../svg/config-motion.mjs';

function createMotionComponentFactory(preloadedFeatures, createVisualElement) {
    return function createMotionComponent(Component, { forwardMotionProps } = { forwardMotionProps: false }) {
        const baseConfig = isSVGComponent(Component)
            ? svgMotionConfig
            : htmlMotionConfig;
        const config = {
            ...baseConfig,
            preloadedFeatures,
            useRender: createUseRender(forwardMotionProps),
            createVisualElement,
            Component,
        };
        return createRendererMotionComponent(config);
    };
}

export { createMotionComponentFactory };
