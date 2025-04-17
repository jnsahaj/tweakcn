import { kCH, kE, sinθ, cosθ, θ, factor } from './constants.js';
import normalizeHue from '../util/normalizeHue.js';

/*
	Convert CIELab D65 to DIN99o LCh
	================================
 */

const convertLab65ToDlch = ({ l, a, b, alpha }) => {
	if (l === undefined) l = 0;
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let e = a * cosθ + b * sinθ;
	let f = 0.83 * (b * cosθ - a * sinθ);
	let G = Math.sqrt(e * e + f * f);
	let res = {
		mode: 'dlch',
		l: (factor / kE) * Math.log(1 + 0.0039 * l),
		c: Math.log(1 + 0.075 * G) / (0.0435 * kCH * kE)
	};

	if (res.c) {
		res.h = normalizeHue(((Math.atan2(f, e) + θ) / Math.PI) * 180);
	}

	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertLab65ToDlch;
