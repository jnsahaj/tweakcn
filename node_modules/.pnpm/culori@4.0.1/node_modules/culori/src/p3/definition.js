import rgb from '../rgb/definition.js';
import convertP3ToXyz65 from './convertP3ToXyz65.js';
import convertXyz65ToP3 from './convertXyz65ToP3.js';
import convertRgbToXyz65 from '../xyz65/convertRgbToXyz65.js';
import convertXyz65ToRgb from '../xyz65/convertXyz65ToRgb.js';

const definition = {
	...rgb,
	mode: 'p3',
	parse: ['display-p3'],
	serialize: 'display-p3',

	fromMode: {
		rgb: color => convertXyz65ToP3(convertRgbToXyz65(color)),
		xyz65: convertXyz65ToP3
	},

	toMode: {
		rgb: color => convertXyz65ToRgb(convertP3ToXyz65(color)),
		xyz65: convertP3ToXyz65
	}
};

export default definition;
