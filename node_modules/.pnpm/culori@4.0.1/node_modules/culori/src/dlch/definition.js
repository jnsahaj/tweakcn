import convertLabToLch from '../lch/convertLabToLch.js';
import convertLchToLab from '../lch/convertLchToLab.js';
import convertDlchToLab65 from './convertDlchToLab65.js';
import convertLab65ToDlch from './convertLab65ToDlch.js';
import convertLab65ToRgb from '../lab65/convertLab65ToRgb.js';
import convertRgbToLab65 from '../lab65/convertRgbToLab65.js';

import { fixupHueShorter } from '../fixup/hue.js';
import { fixupAlpha } from '../fixup/alpha.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { differenceHueChroma } from '../difference.js';
import { averageAngle } from '../average.js';

const definition = {
	mode: 'dlch',

	parse: ['--din99o-lch'],
	serialize: '--din99o-lch',

	toMode: {
		lab65: convertDlchToLab65,
		dlab: c => convertLchToLab(c, 'dlab'),
		rgb: c => convertLab65ToRgb(convertDlchToLab65(c))
	},

	fromMode: {
		lab65: convertLab65ToDlch,
		dlab: c => convertLabToLch(c, 'dlch'),
		rgb: c => convertLab65ToDlch(convertRgbToLab65(c))
	},

	channels: ['l', 'c', 'h', 'alpha'],

	ranges: {
		l: [0, 100],
		c: [0, 51.484],
		h: [0, 360]
	},

	interpolate: {
		l: interpolatorLinear,
		c: interpolatorLinear,
		h: {
			use: interpolatorLinear,
			fixup: fixupHueShorter
		},
		alpha: {
			use: interpolatorLinear,
			fixup: fixupAlpha
		}
	},

	difference: {
		h: differenceHueChroma
	},

	average: {
		h: averageAngle
	}
};

export default definition;
