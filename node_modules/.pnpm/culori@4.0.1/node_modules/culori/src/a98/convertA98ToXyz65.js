/*
	Convert A98 RGB values to CIE XYZ D65

	References:
		* https://drafts.csswg.org/css-color/#color-conversion-code
		* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		* https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
*/

const linearize = (v = 0) => Math.pow(Math.abs(v), 563 / 256) * Math.sign(v);

const convertA98ToXyz65 = a98 => {
	let r = linearize(a98.r);
	let g = linearize(a98.g);
	let b = linearize(a98.b);
	let res = {
		mode: 'xyz65',
		x:
			0.5766690429101305 * r +
			0.1855582379065463 * g +
			0.1882286462349947 * b,
		y:
			0.297344975250536 * r +
			0.6273635662554661 * g +
			0.0752914584939979 * b,
		z:
			0.0270313613864123 * r +
			0.0706888525358272 * g +
			0.9913375368376386 * b
	};
	if (a98.alpha !== undefined) {
		res.alpha = a98.alpha;
	}
	return res;
};

export default convertA98ToXyz65;
