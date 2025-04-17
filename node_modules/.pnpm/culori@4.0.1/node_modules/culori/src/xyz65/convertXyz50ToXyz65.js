/*
	Chromatic adaptation of CIE XYZ from D50 to D65 white point
	using the Bradford method.

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html	
*/

const convertXyz50ToXyz65 = xyz50 => {
	let { x, y, z, alpha } = xyz50;
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let res = {
		mode: 'xyz65',
		x:
			0.9554734527042182 * x -
			0.0230985368742614 * y +
			0.0632593086610217 * z,
		y:
			-0.0283697069632081 * x +
			1.0099954580058226 * y +
			0.021041398966943 * z,
		z:
			0.0123140016883199 * x -
			0.0205076964334779 * y +
			1.3303659366080753 * z
	};
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertXyz50ToXyz65;
