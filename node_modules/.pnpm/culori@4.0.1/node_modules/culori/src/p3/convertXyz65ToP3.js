/*
	CIE XYZ D65 values to Display P3.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

import convertLrgbToRgb from '../lrgb/convertLrgbToRgb.js';

const convertXyz65ToP3 = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = convertLrgbToRgb(
		{
			r:
				x * 2.4934969119414263 -
				y * 0.9313836179191242 -
				0.402710784450717 * z,
			g:
				x * -0.8294889695615749 +
				y * 1.7626640603183465 +
				0.0236246858419436 * z,
			b:
				x * 0.0358458302437845 -
				y * 0.0761723892680418 +
				0.9568845240076871 * z
		},
		'p3'
	);
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertXyz65ToP3;
