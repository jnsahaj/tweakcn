import lch from '../lch/definition.js';
import convertLabToLch from '../lch/convertLabToLch.js';
import convertLchToLab from '../lch/convertLchToLab.js';
import convertOklabToRgb from '../oklab/convertOklabToRgb.js';
import convertRgbToOklab from '../oklab/convertRgbToOklab.js';
import parseOklch from './parseOklch.js';

const definition = {
	...lch,
	mode: 'oklch',

	toMode: {
		oklab: c => convertLchToLab(c, 'oklab'),
		rgb: c => convertOklabToRgb(convertLchToLab(c, 'oklab'))
	},

	fromMode: {
		rgb: c => convertLabToLch(convertRgbToOklab(c), 'oklch'),
		oklab: c => convertLabToLch(c, 'oklch')
	},

	parse: [parseOklch],
	serialize: c =>
		`oklch(${c.l !== undefined ? c.l : 'none'} ${
			c.c !== undefined ? c.c : 'none'
		} ${c.h !== undefined ? c.h : 'none'}${
			c.alpha < 1 ? ` / ${c.alpha}` : ''
		})`,

	ranges: {
		l: [0, 1],
		c: [0, 0.4],
		h: [0, 360]
	}
};

export default definition;
