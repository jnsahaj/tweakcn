import convertJabToJch from './convertJabToJch.js';
import convertJchToJab from './convertJchToJab.js';
import convertJabToRgb from '../jab/convertJabToRgb.js';
import convertRgbToJab from '../jab/convertRgbToJab.js';

import { fixupHueShorter } from '../fixup/hue.js';
import { fixupAlpha } from '../fixup/alpha.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { differenceHueChroma } from '../difference.js';
import { averageAngle } from '../average.js';

const definition = {
	mode: 'jch',

	parse: ['--jzczhz'],
	serialize: '--jzczhz',

	toMode: {
		jab: convertJchToJab,
		rgb: c => convertJabToRgb(convertJchToJab(c))
	},

	fromMode: {
		rgb: c => convertJabToJch(convertRgbToJab(c)),
		jab: convertJabToJch
	},

	channels: ['j', 'c', 'h', 'alpha'],

	ranges: {
		j: [0, 0.221],
		c: [0, 0.19],
		h: [0, 360]
	},

	interpolate: {
		h: { use: interpolatorLinear, fixup: fixupHueShorter },
		c: interpolatorLinear,
		j: interpolatorLinear,
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
