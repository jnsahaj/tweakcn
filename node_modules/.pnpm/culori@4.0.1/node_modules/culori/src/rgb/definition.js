import parseNamed from './parseNamed.js';
import parseHex from './parseHex.js';
import parseRgbLegacy from './parseRgbLegacy.js';
import parseRgb from './parseRgb.js';
import parseTransparent from './parseTransparent.js';
import { interpolatorLinear } from '../interpolate/linear.js';
import { fixupAlpha } from '../fixup/alpha.js';

/*
	sRGB color space
 */

const definition = {
	mode: 'rgb',
	channels: ['r', 'g', 'b', 'alpha'],
	parse: [
		parseRgb,
		parseHex,
		parseRgbLegacy,
		parseNamed,
		parseTransparent,
		'srgb'
	],
	serialize: 'srgb',
	interpolate: {
		r: interpolatorLinear,
		g: interpolatorLinear,
		b: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	},
	gamut: true,
	white: { r: 1, g: 1, b: 1 },
	black: { r: 0, g: 0, b: 0 }
};

export default definition;
