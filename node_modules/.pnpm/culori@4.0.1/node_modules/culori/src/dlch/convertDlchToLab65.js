import { kCH, kE, sinθ, cosθ, θ, factor } from './constants.js';

/*
	Convert DIN99o LCh to CIELab D65
	--------------------------------
 */

const convertDlchToLab65 = ({ l, c, h, alpha }) => {
	if (l === undefined) l = 0;
	if (c === undefined) c = 0;
	if (h === undefined) h = 0;
	let res = {
		mode: 'lab65',
		l: (Math.exp((l * kE) / factor) - 1) / 0.0039
	};

	let G = (Math.exp(0.0435 * c * kCH * kE) - 1) / 0.075;
	let e = G * Math.cos((h / 180) * Math.PI - θ);
	let f = G * Math.sin((h / 180) * Math.PI - θ);
	res.a = e * cosθ - (f / 0.83) * sinθ;
	res.b = e * sinθ + (f / 0.83) * cosθ;

	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertDlchToLab65;
