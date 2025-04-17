import normalizeHue from '../util/normalizeHue.js';

/* 
	References: 
		* https://drafts.csswg.org/css-color/#lab-to-lch
		* https://drafts.csswg.org/css-color/#color-conversion-code
*/
const convertLabToLch = ({ l, a, b, alpha }, mode = 'lch') => {
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let c = Math.sqrt(a * a + b * b);
	let res = { mode, l, c };
	if (c) res.h = normalizeHue((Math.atan2(b, a) * 180) / Math.PI);
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertLabToLch;
