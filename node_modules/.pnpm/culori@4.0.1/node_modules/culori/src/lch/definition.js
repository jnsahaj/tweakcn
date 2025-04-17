import convertLabToLch from './convertLabToLch.js';
import convertLchToLab from './convertLchToLab.js';
import convertLabToRgb from '../lab/convertLabToRgb.js';
import convertRgbToLab from '../lab/convertRgbToLab.js';
import parseLch from './parseLch.js';
import { fixupHueShorter } from '../fixup/hue.js';
import { fixupAlpha } from '../fixup/alpha.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { differenceHueChroma } from '../difference.js';
import { averageAngle } from '../average.js';

const definition = {
	mode: 'lch',

	toMode: {
		lab: convertLchToLab,
		rgb: c => convertLabToRgb(convertLchToLab(c))
	},

	fromMode: {
		rgb: c => convertLabToLch(convertRgbToLab(c)),
		lab: convertLabToLch
	},

	channels: ['l', 'c', 'h', 'alpha'],

	ranges: {
		l: [0, 100],
		c: [0, 150],
		h: [0, 360]
	},

	parse: [parseLch],
	serialize: c =>
		`lch(${c.l !== undefined ? c.l : 'none'} ${
			c.c !== undefined ? c.c : 'none'
		} ${c.h !== undefined ? c.h : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

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
