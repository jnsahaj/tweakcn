/*
	Convert ProPhoto RGB values to CIE XYZ D50

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
*/

const linearize = (v = 0) => {
	let abs = Math.abs(v);
	if (abs >= 16 / 512) {
		return Math.sign(v) * Math.pow(abs, 1.8);
	}
	return v / 16;
};

const convertProphotoToXyz50 = prophoto => {
	let r = linearize(prophoto.r);
	let g = linearize(prophoto.g);
	let b = linearize(prophoto.b);
	let res = {
		mode: 'xyz50',
		x:
			0.7977666449006423 * r +
			0.1351812974005331 * g +
			0.0313477341283922 * b,
		y:
			0.2880748288194013 * r +
			0.7118352342418731 * g +
			0.0000899369387256 * b,
		z: 0 * r + 0 * g + 0.8251046025104602 * b
	};
	if (prophoto.alpha !== undefined) {
		res.alpha = prophoto.alpha;
	}
	return res;
};

export default convertProphotoToXyz50;
