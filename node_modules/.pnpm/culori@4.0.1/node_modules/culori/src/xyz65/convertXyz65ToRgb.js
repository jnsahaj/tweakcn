/*
	CIE XYZ D65 values to sRGB.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://observablehq.com/@danburzo/color-matrix-calculator
*/

import convertLrgbToRgb from '../lrgb/convertLrgbToRgb.js';

const convertXyz65ToRgb = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = convertLrgbToRgb({
		r:
			x * 3.2409699419045226 -
			y * 1.5373831775700939 -
			0.4986107602930034 * z,
		g:
			x * -0.9692436362808796 +
			y * 1.8759675015077204 +
			0.0415550574071756 * z,
		b:
			x * 0.0556300796969936 -
			y * 0.2039769588889765 +
			1.0569715142428784 * z
	});
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertXyz65ToRgb;
