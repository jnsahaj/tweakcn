import convertRgbToOklab from '../oklab/convertRgbToOklab.js';
import convertOklabToRgb from '../oklab/convertOklabToRgb.js';
import convertOklabToOkhsl from './convertOklabToOkhsl.js';
import convertOkhslToOklab from './convertOkhslToOklab.js';

import modeHsl from '../hsl/definition.js';

const modeOkhsl = {
	...modeHsl,
	mode: 'okhsl',
	channels: ['h', 's', 'l', 'alpha'],
	parse: ['--okhsl'],
	serialize: '--okhsl',
	fromMode: {
		oklab: convertOklabToOkhsl,
		rgb: c => convertOklabToOkhsl(convertRgbToOklab(c))
	},
	toMode: {
		oklab: convertOkhslToOklab,
		rgb: c => convertOklabToRgb(convertOkhslToOklab(c))
	}
};

export default modeOkhsl;
