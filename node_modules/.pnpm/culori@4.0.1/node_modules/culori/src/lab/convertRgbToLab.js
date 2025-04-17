import convertRgbToXyz50 from '../xyz50/convertRgbToXyz50.js';
import convertXyz50ToLab from './convertXyz50ToLab.js';

const convertRgbToLab = rgb => {
	let res = convertXyz50ToLab(convertRgbToXyz50(rgb));

	// Fixes achromatic RGB colors having a _slight_ chroma due to floating-point errors
	// and approximated computations in sRGB <-> CIELab.
	// See: https://github.com/d3/d3-color/pull/46
	if (rgb.r === rgb.b && rgb.b === rgb.g) {
		res.a = res.b = 0;
	}
	return res;
};

export default convertRgbToLab;
