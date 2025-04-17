import '../../../../../motion-utils/dist/es/errors.mjs';
import { progress } from '../../../../../motion-utils/dist/es/progress.mjs';
import { mixNumber } from '../mix/number.mjs';

function fillOffset(offset, remaining) {
    const min = offset[offset.length - 1];
    for (let i = 1; i <= remaining; i++) {
        const offsetProgress = progress(0, remaining, i);
        offset.push(mixNumber(min, 1, offsetProgress));
    }
}

export { fillOffset };
