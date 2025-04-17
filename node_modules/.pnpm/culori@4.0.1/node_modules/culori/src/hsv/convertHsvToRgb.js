import normalizeHue from '../util/normalizeHue.js';

// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB

export default function convertHsvToRgb({ h, s, v, alpha }) {
	h = normalizeHue(h !== undefined ? h : 0);
	if (s === undefined) s = 0;
	if (v === undefined) v = 0;
	let f = Math.abs(((h / 60) % 2) - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = { r: v, g: v * (1 - s * f), b: v * (1 - s) };
			break;
		case 1:
			res = { r: v * (1 - s * f), g: v, b: v * (1 - s) };
			break;
		case 2:
			res = { r: v * (1 - s), g: v, b: v * (1 - s * f) };
			break;
		case 3:
			res = { r: v * (1 - s), g: v * (1 - s * f), b: v };
			break;
		case 4:
			res = { r: v * (1 - s * f), g: v * (1 - s), b: v };
			break;
		case 5:
			res = { r: v, g: v * (1 - s), b: v * (1 - s * f) };
			break;
		default:
			res = { r: v * (1 - s), g: v * (1 - s), b: v * (1 - s) };
	}
	res.mode = 'rgb';
	if (alpha !== undefined) res.alpha = alpha;
	return res;
}
