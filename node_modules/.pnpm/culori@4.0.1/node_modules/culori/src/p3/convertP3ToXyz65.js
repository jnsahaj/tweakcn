/*
	Convert Display P3 values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

import convertRgbToLrgb from '../lrgb/convertRgbToLrgb.js';

const convertP3ToXyz65 = rgb => {
	let { r, g, b, alpha } = convertRgbToLrgb(rgb);
	let res = {
		mode: 'xyz65',
		x:
			0.486570948648216 * r +
			0.265667693169093 * g +
			0.1982172852343625 * b,
		y:
			0.2289745640697487 * r +
			0.6917385218365062 * g +
			0.079286914093745 * b,
		z: 0.0 * r + 0.0451133818589026 * g + 1.043944368900976 * b
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertP3ToXyz65;
