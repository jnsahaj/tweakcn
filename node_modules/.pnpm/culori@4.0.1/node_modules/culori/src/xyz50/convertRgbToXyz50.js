/*
	Convert sRGB values to CIE XYZ D50

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
	
*/

import convertRgbToLrgb from '../lrgb/convertRgbToLrgb.js';

const convertRgbToXyz50 = rgb => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: 'xyz50',
		x:
			0.436065742824811 * r +
			0.3851514688337912 * g +
			0.14307845442264197 * b,
		y:
			0.22249319175623702 * r +
			0.7168870538238823 * g +
			0.06061979053616537 * b,
		z:
			0.013923904500943465 * r +
			0.09708128566574634 * g +
			0.7140993584005155 * b
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertRgbToXyz50;
