/*
	The XYZ D65 color space
	-----------------------
 */

import convertXyz65ToRgb from './convertXyz65ToRgb.js';
import convertRgbToXyz65 from './convertRgbToXyz65.js';

import convertXyz65ToXyz50 from './convertXyz65ToXyz50.js';
import convertXyz50ToXyz65 from './convertXyz50ToXyz65.js';

import { interpolatorLinear } from '../interpolate/linear.js';
import { fixupAlpha } from '../fixup/alpha.js';

const definition = {
	mode: 'xyz65',

	toMode: {
		rgb: convertXyz65ToRgb,
		xyz50: convertXyz65ToXyz50
	},

	fromMode: {
		rgb: convertRgbToXyz65,
		xyz50: convertXyz50ToXyz65
	},

	ranges: {
		x: [0, 0.95],
		y: [0, 1],
		z: [0, 1.088]
	},

	channels: ['x', 'y', 'z', 'alpha'],

	parse: ['xyz', 'xyz-d65'],
	serialize: 'xyz-d65',

	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

export default definition;
