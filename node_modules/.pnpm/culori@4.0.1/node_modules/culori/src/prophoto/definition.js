import rgb from '../rgb/definition.js';

import convertXyz50ToProphoto from './convertXyz50ToProphoto.js';
import convertProphotoToXyz50 from './convertProphotoToXyz50.js';

import convertXyz50ToRgb from '../xyz50/convertXyz50ToRgb.js';
import convertRgbToXyz50 from '../xyz50/convertRgbToXyz50.js';

/*
	ProPhoto RGB Color space

	References:
		* https://en.wikipedia.org/wiki/ProPhoto_RGB_color_space
 */

const definition = {
	...rgb,
	mode: 'prophoto',
	parse: ['prophoto-rgb'],
	serialize: 'prophoto-rgb',

	fromMode: {
		xyz50: convertXyz50ToProphoto,
		rgb: color => convertXyz50ToProphoto(convertRgbToXyz50(color))
	},

	toMode: {
		xyz50: convertProphotoToXyz50,
		rgb: color => convertXyz50ToRgb(convertProphotoToXyz50(color))
	}
};

export default definition;
