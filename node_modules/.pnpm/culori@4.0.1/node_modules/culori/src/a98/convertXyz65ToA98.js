/*
	Convert CIE XYZ D65 values to A98 RGB

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

const gamma = v => Math.pow(Math.abs(v), 256 / 563) * Math.sign(v);

const convertXyz65ToA98 = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'a98',
		r: gamma(
			x * 2.0415879038107465 -
				y * 0.5650069742788597 -
				0.3447313507783297 * z
		),
		g: gamma(
			x * -0.9692436362808798 +
				y * 1.8759675015077206 +
				0.0415550574071756 * z
		),
		b: gamma(
			x * 0.0134442806320312 -
				y * 0.1183623922310184 +
				1.0151749943912058 * z
		)
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertXyz65ToA98;
