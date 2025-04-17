import convertHsvToRgb from './convertHsvToRgb.js';
import convertRgbToHsv from './convertRgbToHsv.js';
import { fixupHueShorter } from '../fixup/hue.js';
import { fixupAlpha } from '../fixup/alpha.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { differenceHueSaturation } from '../difference.js';
import { averageAngle } from '../average.js';

const definition = {
	mode: 'hsv',

	toMode: {
		rgb: convertHsvToRgb
	},

	parse: ['--hsv'],
	serialize: '--hsv',

	fromMode: {
		rgb: convertRgbToHsv
	},

	channels: ['h', 's', 'v', 'alpha'],

	ranges: {
		h: [0, 360]
	},

	gamut: 'rgb',

	interpolate: {
		h: { use: interpolatorLinear, fixup: fixupHueShorter },
		s: interpolatorLinear,
		v: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	},

	difference: {
		h: differenceHueSaturation
	},

	average: {
		h: averageAngle
	}
};

export default definition;
