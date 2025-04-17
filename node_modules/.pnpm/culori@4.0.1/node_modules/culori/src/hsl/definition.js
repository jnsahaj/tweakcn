import convertHslToRgb from './convertHslToRgb.js';
import convertRgbToHsl from './convertRgbToHsl.js';
import parseHslLegacy from './parseHslLegacy.js';
import parseHsl from './parseHsl.js';
import { fixupHueShorter } from '../fixup/hue.js';
import { fixupAlpha } from '../fixup/alpha.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { differenceHueSaturation } from '../difference.js';
import { averageAngle } from '../average.js';

const definition = {
	mode: 'hsl',

	toMode: {
		rgb: convertHslToRgb
	},

	fromMode: {
		rgb: convertRgbToHsl
	},

	channels: ['h', 's', 'l', 'alpha'],

	ranges: {
		h: [0, 360]
	},

	gamut: 'rgb',

	parse: [parseHsl, parseHslLegacy],
	serialize: c =>
		`hsl(${c.h !== undefined ? c.h : 'none'} ${
			c.s !== undefined ? c.s * 100 + '%' : 'none'
		} ${c.l !== undefined ? c.l * 100 + '%' : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	interpolate: {
		h: { use: interpolatorLinear, fixup: fixupHueShorter },
		s: interpolatorLinear,
		l: interpolatorLinear,
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
