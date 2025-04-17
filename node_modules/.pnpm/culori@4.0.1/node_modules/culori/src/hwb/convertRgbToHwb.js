/*
	RGB to HWB converter
	--------------------

	References:
		* https://drafts.csswg.org/css-color/#hwb-to-rgb
		* https://en.wikipedia.org/wiki/HWB_color_model
		* http://alvyray.com/Papers/CG/HWB_JGTv208.pdf
 */

import convertRgbToHsv from '../hsv/convertRgbToHsv.js';

export default function convertRgbToHwb(rgba) {
	let hsv = convertRgbToHsv(rgba);
	if (hsv === undefined) return undefined;
	let s = hsv.s !== undefined ? hsv.s : 0;
	let v = hsv.v !== undefined ? hsv.v : 0;
	let res = {
		mode: 'hwb',
		w: (1 - s) * v,
		b: 1 - v
	};
	if (hsv.h !== undefined) res.h = hsv.h;
	if (hsv.alpha !== undefined) res.alpha = hsv.alpha;
	return res;
}
