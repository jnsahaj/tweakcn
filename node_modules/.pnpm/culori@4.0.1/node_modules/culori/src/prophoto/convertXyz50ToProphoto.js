/*
	Convert CIE XYZ D50 values to ProPhoto RGB

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

const gamma = v => {
	let abs = Math.abs(v);
	if (abs >= 1 / 512) {
		return Math.sign(v) * Math.pow(abs, 1 / 1.8);
	}
	return 16 * v;
};

const convertXyz50ToProphoto = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'prophoto',
		r: gamma(
			x * 1.3457868816471585 -
				y * 0.2555720873797946 -
				0.0511018649755453 * z
		),
		g: gamma(
			x * -0.5446307051249019 +
				y * 1.5082477428451466 +
				0.0205274474364214 * z
		),
		b: gamma(x * 0.0 + y * 0.0 + 1.2119675456389452 * z)
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertXyz50ToProphoto;
