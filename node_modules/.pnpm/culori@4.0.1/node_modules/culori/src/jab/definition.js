/*
	The JzAzBz color space.

	Based on:

	Muhammad Safdar, Guihua Cui, Youn Jin Kim, and Ming Ronnier Luo, 
	"Perceptually uniform color space for image signals 
	including high dynamic range and wide gamut," 
	Opt. Express 25, 15131-15151 (2017) 

	https://doi.org/10.1364/OE.25.015131
 */

import convertXyz65ToJab from './convertXyz65ToJab.js';
import convertJabToXyz65 from './convertJabToXyz65.js';
import convertRgbToJab from './convertRgbToJab.js';
import convertJabToRgb from './convertJabToRgb.js';

import { interpolatorLinear } from '../interpolate/linear.js';
import { fixupAlpha } from '../fixup/alpha.js';

const definition = {
	mode: 'jab',
	channels: ['j', 'a', 'b', 'alpha'],

	parse: ['--jzazbz'],
	serialize: '--jzazbz',

	fromMode: {
		rgb: convertRgbToJab,
		xyz65: convertXyz65ToJab
	},

	toMode: {
		rgb: convertJabToRgb,
		xyz65: convertJabToXyz65
	},

	ranges: {
		j: [0, 0.222],
		a: [-0.109, 0.129],
		b: [-0.185, 0.134]
	},

	interpolate: {
		j: interpolatorLinear,
		a: interpolatorLinear,
		b: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

export default definition;
