/*
	CIE XYZ D50 values to sRGB.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

import convertLrgbToRgb from '../lrgb/convertLrgbToRgb.js';

const convertXyz50ToRgb = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = convertLrgbToRgb({
		r:
			x * 3.1341359569958707 -
			y * 1.6173863321612538 -
			0.4906619460083532 * z,
		g:
			x * -0.978795502912089 +
			y * 1.916254567259524 +
			0.03344273116131949 * z,
		b:
			x * 0.07195537988411677 -
			y * 0.2289768264158322 +
			1.405386058324125 * z
	});
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertXyz50ToRgb;
