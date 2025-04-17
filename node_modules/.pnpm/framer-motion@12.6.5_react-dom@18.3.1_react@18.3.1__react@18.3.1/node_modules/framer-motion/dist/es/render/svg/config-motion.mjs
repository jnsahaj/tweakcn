import { frame } from 'motion-dom';
import { makeUseVisualState } from '../../motion/utils/use-visual-state.mjs';
import { transformProps } from '../html/utils/keys-transform.mjs';
import { buildSVGAttrs } from './utils/build-attrs.mjs';
import { createSvgRenderState } from './utils/create-render-state.mjs';
import { isSVGTag } from './utils/is-svg-tag.mjs';
import { updateSVGDimensions } from './utils/measure.mjs';
import { renderSVG } from './utils/render.mjs';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.mjs';

const layoutProps = ["x", "y", "width", "height", "cx", "cy", "r"];
const svgMotionConfig = {
    useVisualState: makeUseVisualState({
        scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
        createRenderState: createSvgRenderState,
        onUpdate: ({ props, prevProps, current, renderState, latestValues, }) => {
            if (!current)
                return;
            let hasTransform = !!props.drag;
            if (!hasTransform) {
                for (const key in latestValues) {
                    if (transformProps.has(key)) {
                        hasTransform = true;
                        break;
                    }
                }
            }
            if (!hasTransform)
                return;
            let needsMeasure = !prevProps;
            if (prevProps) {
                /**
                 * Check the layout props for changes, if any are found we need to
                 * measure the element again.
                 */
                for (let i = 0; i < layoutProps.length; i++) {
                    const key = layoutProps[i];
                    if (props[key] !==
                        prevProps[key]) {
                        needsMeasure = true;
                    }
                }
            }
            if (!needsMeasure)
                return;
            frame.read(() => {
                updateSVGDimensions(current, renderState);
                frame.render(() => {
                    buildSVGAttrs(renderState, latestValues, isSVGTag(current.tagName), props.transformTemplate);
                    renderSVG(current, renderState);
                });
            });
        },
    }),
};

export { svgMotionConfig };
