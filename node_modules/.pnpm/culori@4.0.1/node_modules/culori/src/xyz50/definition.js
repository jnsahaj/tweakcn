/*
	The XYZ D50 color space
	-----------------------
 */

import convertXyz50ToRgb from './convertXyz50ToRgb.js';
import convertXyz50ToLab from '../lab/convertXyz50ToLab.js';
import convertRgbToXyz50 from './convertRgbToXyz50.js';
import convertLabToXyz50 from '../lab/convertLabToXyz50.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { fixupAlpha } from '../fixup/alpha.js';

const definition = {
	mode: 'xyz50',
	parse: ['xyz-d50'],
	serialize: 'xyz-d50',

	toMode: {
		rgb: convertXyz50ToRgb,
		lab: convertXyz50ToLab
	},

	fromMode: {
		rgb: convertRgbToXyz50,
		lab: convertLabToXyz50
	},

	channels: ['x', 'y', 'z', 'alpha'],

	ranges: {
		x: [0, 0.964],
		y: [0, 0.999],
		z: [0, 0.825]
	},

	interpolate: {
		x: interpolatorLinear,
		y: interpolatorLinear,
		z: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

export default definition;
