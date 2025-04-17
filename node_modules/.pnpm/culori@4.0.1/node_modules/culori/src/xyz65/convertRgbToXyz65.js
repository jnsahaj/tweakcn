/*
	Convert sRGB values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://observablehq.com/@danburzo/color-matrix-calculator
*/

import convertRgbToLrgb from '../lrgb/convertRgbToLrgb.js';

const convertRgbToXyz65 = rgb => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: 'xyz65',
		x:
			0.4123907992659593 * r +
			0.357584339383878 * g +
			0.1804807884018343 * b,
		y:
			0.2126390058715102 * r +
			0.715168678767756 * g +
			0.0721923153607337 * b,
		z:
			0.0193308187155918 * r +
			0.119194779794626 * g +
			0.9505321522496607 * b
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertRgbToXyz65;
