import rgb from '../rgb/definition.js';
import convertRgbToLrgb from './convertRgbToLrgb.js';
import convertLrgbToRgb from './convertLrgbToRgb.js';

const definition = {
	...rgb,
	mode: 'lrgb',

	toMode: {
		rgb: convertLrgbToRgb
	},

	fromMode: {
		rgb: convertRgbToLrgb
	},

	parse: ['srgb-linear'],
	serialize: 'srgb-linear'
};

export default definition;
