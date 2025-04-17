/*
	Chromatic adaptation of CIE XYZ from D65 to D50 white point
	using the Bradford method.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html	
*/

const convertXyz65ToXyz50 = xyz65 => {
	let { x, y, z, alpha } = xyz65;
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'xyz50',
		x:
			1.0479298208405488 * x +
			0.0229467933410191 * y -
			0.0501922295431356 * z,
		y:
			0.0296278156881593 * x +
			0.990434484573249 * y -
			0.0170738250293851 * z,
		z:
			-0.0092430581525912 * x +
			0.0150551448965779 * y +
			0.7518742899580008 * z
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertXyz65ToXyz50;
