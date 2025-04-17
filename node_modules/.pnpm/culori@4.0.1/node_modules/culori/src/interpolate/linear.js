import { lerp } from './lerp.js';
import { interpolatorPiecewise } from './piecewise.js';

export const interpolatorLinear = interpolatorPiecewise(lerp);
