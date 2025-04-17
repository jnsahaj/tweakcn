/*
	CIELUV color space
	------------------

	Reference: 

		https://en.wikipedia.org/wiki/CIELUV
 */

import convertXyz50ToLuv from './convertXyz50ToLuv.js';
import convertLuvToXyz50 from './convertLuvToXyz50.js';
import convertXyz50ToRgb from '../xyz50/convertXyz50ToRgb.js';
import convertRgbToXyz50 from '../xyz50/convertRgbToXyz50.js';

import { interpolatorLinear } from '../interpolate/linear.js';
import { fixupAlpha } from '../fixup/alpha.js';

const definition = {
	mode: 'luv',

	toMode: {
		xyz50: convertLuvToXyz50,
		rgb: luv => convertXyz50ToRgb(convertLuvToXyz50(luv))
	},

	fromMode: {
		xyz50: convertXyz50ToLuv,
		rgb: rgb => convertXyz50ToLuv(convertRgbToXyz50(rgb))
	},

	channels: ['l', 'u', 'v', 'alpha'],

	parse: ['--luv'],
	serialize: '--luv',

	ranges: {
		l: [0, 100],
		u: [-84.936, 175.042],
		v: [-125.882, 87.243]
	},

	interpolate: {
		l: interpolatorLinear,
		u: interpolatorLinear,
		v: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

export default definition;
