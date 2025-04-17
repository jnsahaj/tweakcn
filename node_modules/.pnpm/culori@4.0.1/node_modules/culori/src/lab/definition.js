import convertLabToRgb from './convertLabToRgb.js';
import convertLabToXyz50 from './convertLabToXyz50.js';
import convertRgbToLab from './convertRgbToLab.js';
import convertXyz50ToLab from './convertXyz50ToLab.js';
import parseLab from './parseLab.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { fixupAlpha } from '../fixup/alpha.js';

const definition = {
	mode: 'lab',

	toMode: {
		xyz50: convertLabToXyz50,
		rgb: convertLabToRgb
	},

	fromMode: {
		xyz50: convertXyz50ToLab,
		rgb: convertRgbToLab
	},

	channels: ['l', 'a', 'b', 'alpha'],

	ranges: {
		l: [0, 100],
		a: [-100, 100],
		b: [-100, 100]
	},

	parse: [parseLab],
	serialize: c =>
		`lab(${c.l !== undefined ? c.l : 'none'} ${
			c.a !== undefined ? c.a : 'none'
		} ${c.b !== undefined ? c.b : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	interpolate: {
		l: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

export default definition;
