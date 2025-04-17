/*
	CIELChuv color space
	--------------------

	Reference: 

		https://en.wikipedia.org/wiki/CIELUV
 */

import convertLuvToLchuv from './convertLuvToLchuv.js';
import convertLchuvToLuv from './convertLchuvToLuv.js';
import convertXyz50ToLuv from '../luv/convertXyz50ToLuv.js';
import convertLuvToXyz50 from '../luv/convertLuvToXyz50.js';
import convertXyz50ToRgb from '../xyz50/convertXyz50ToRgb.js';
import convertRgbToXyz50 from '../xyz50/convertRgbToXyz50.js';

import { fixupHueShorter } from '../fixup/hue.js';
import { fixupAlpha } from '../fixup/alpha.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { differenceHueChroma } from '../difference.js';
import { averageAngle } from '../average.js';

const convertRgbToLchuv = rgb =>
	convertLuvToLchuv(convertXyz50ToLuv(convertRgbToXyz50(rgb)));
const convertLchuvToRgb = lchuv =>
	convertXyz50ToRgb(convertLuvToXyz50(convertLchuvToLuv(lchuv)));

const definition = {
	mode: 'lchuv',

	toMode: {
		luv: convertLchuvToLuv,
		rgb: convertLchuvToRgb
	},

	fromMode: {
		rgb: convertRgbToLchuv,
		luv: convertLuvToLchuv
	},

	channels: ['l', 'c', 'h', 'alpha'],

	parse: ['--lchuv'],
	serialize: '--lchuv',

	ranges: {
		l: [0, 100],
		c: [0, 176.956],
		h: [0, 360]
	},

	interpolate: {
		h: { use: interpolatorLinear, fixup: fixupHueShorter },
		c: interpolatorLinear,
		l: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	},

	difference: {
		h: differenceHueChroma
	},

	average: {
		h: averageAngle
	}
};

export default definition;
