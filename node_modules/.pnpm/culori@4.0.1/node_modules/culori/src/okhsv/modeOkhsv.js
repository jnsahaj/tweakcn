import convertRgbToOklab from '../oklab/convertRgbToOklab.js';
import convertOklabToRgb from '../oklab/convertOklabToRgb.js';
import convertOklabToOkhsv from './convertOklabToOkhsv.js';
import convertOkhsvToOklab from './convertOkhsvToOklab.js';

import modeHsv from '../hsv/definition.js';

const modeOkhsv = {
	...modeHsv,
	mode: 'okhsv',
	channels: ['h', 's', 'v', 'alpha'],
	parse: ['--okhsv'],
	serialize: '--okhsv',
	fromMode: {
		oklab: convertOklabToOkhsv,
		rgb: c => convertOklabToOkhsv(convertRgbToOklab(c))
	},
	toMode: {
		oklab: convertOkhsvToOklab,
		rgb: c => convertOklabToRgb(convertOkhsvToOklab(c))
	}
};

export default modeOkhsv;
