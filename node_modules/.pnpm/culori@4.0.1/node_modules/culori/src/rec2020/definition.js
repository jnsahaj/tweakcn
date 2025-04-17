import rgb from '../rgb/definition.js';

import convertXyz65ToRec2020 from './convertXyz65ToRec2020.js';
import convertRec2020ToXyz65 from './convertRec2020ToXyz65.js';

import convertRgbToXyz65 from '../xyz65/convertRgbToXyz65.js';
import convertXyz65ToRgb from '../xyz65/convertXyz65ToRgb.js';

const definition = {
	...rgb,
	mode: 'rec2020',

	fromMode: {
		xyz65: convertXyz65ToRec2020,
		rgb: color => convertXyz65ToRec2020(convertRgbToXyz65(color))
	},

	toMode: {
		xyz65: convertRec2020ToXyz65,
		rgb: color => convertXyz65ToRgb(convertRec2020ToXyz65(color))
	},

	parse: ['rec2020'],
	serialize: 'rec2020'
};

export default definition;
