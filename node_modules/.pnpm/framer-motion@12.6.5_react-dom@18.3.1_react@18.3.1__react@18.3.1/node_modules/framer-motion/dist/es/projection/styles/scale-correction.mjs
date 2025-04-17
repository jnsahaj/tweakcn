import { isCSSVariableName } from '../../render/dom/utils/is-css-variable.mjs';

const scaleCorrectors = {};
function addScaleCorrector(correctors) {
    for (const key in correctors) {
        scaleCorrectors[key] = correctors[key];
        if (isCSSVariableName(key)) {
            scaleCorrectors[key].isCSSVariable = true;
        }
    }
}

export { addScaleCorrector, scaleCorrectors };
