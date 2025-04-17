import convertRgbToLrgb from '../lrgb/convertRgbToLrgb.js';
import convertLrgbToOklab from './convertLrgbToOklab.js';

const convertRgbToOklab = rgb => {
	let res = convertLrgbToOklab(convertRgbToLrgb(rgb));
	if (rgb.r === rgb.b && rgb.b === rgb.g) {
		res.a = res.b = 0;
	}
	return res;
};

export default convertRgbToOklab;
