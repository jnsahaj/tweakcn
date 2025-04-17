/*
	Convert Rec. 2020 values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://www.itu.int/rec/R-REC-BT.2020/en
*/

const α = 1.09929682680944;
const β = 0.018053968510807;

const linearize = (v = 0) => {
	let abs = Math.abs(v);
	if (abs < β * 4.5) {
		return v / 4.5;
	}
	return (Math.sign(v) || 1) * Math.pow((abs + α - 1) / α, 1 / 0.45);
};

const convertRec2020ToXyz65 = rec2020 => {
	let r = linearize(rec2020.r);
	let g = linearize(rec2020.g);
	let b = linearize(rec2020.b);
	let res = {
		mode: 'xyz65',
		x:
			0.6369580483012911 * r +
			0.1446169035862083 * g +
			0.1688809751641721 * b,
		y:
			0.262700212011267 * r +
			0.6779980715188708 * g +
			0.059301716469862 * b,
		z: 0 * r + 0.0280726930490874 * g + 1.0609850577107909 * b
	};
	if (rec2020.alpha !== undefined) {
		res.alpha = rec2020.alpha;
	}
	return res;
};

export default convertRec2020ToXyz65;
