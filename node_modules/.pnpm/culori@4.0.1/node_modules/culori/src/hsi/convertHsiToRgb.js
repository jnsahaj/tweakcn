import normalizeHue from '../util/normalizeHue.js';

// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB

export default function convertHsiToRgb({ h, s, i, alpha }) {
	h = normalizeHue(h !== undefined ? h : 0);
	if (s === undefined) s = 0;
	if (i === undefined) i = 0;
	let f = Math.abs(((h / 60) % 2) - 1);
	let res;
	switch (Math.floor(h / 60)) {
		case 0:
			res = {
				r: i * (1 + s * (3 / (2 - f) - 1)),
				g: i * (1 + s * ((3 * (1 - f)) / (2 - f) - 1)),
				b: i * (1 - s)
			};
			break;
		case 1:
			res = {
				r: i * (1 + s * ((3 * (1 - f)) / (2 - f) - 1)),
				g: i * (1 + s * (3 / (2 - f) - 1)),
				b: i * (1 - s)
			};
			break;
		case 2:
			res = {
				r: i * (1 - s),
				g: i * (1 + s * (3 / (2 - f) - 1)),
				b: i * (1 + s * ((3 * (1 - f)) / (2 - f) - 1))
			};
			break;
		case 3:
			res = {
				r: i * (1 - s),
				g: i * (1 + s * ((3 * (1 - f)) / (2 - f) - 1)),
				b: i * (1 + s * (3 / (2 - f) - 1))
			};
			break;
		case 4:
			res = {
				r: i * (1 + s * ((3 * (1 - f)) / (2 - f) - 1)),
				g: i * (1 - s),
				b: i * (1 + s * (3 / (2 - f) - 1))
			};
			break;
		case 5:
			res = {
				r: i * (1 + s * (3 / (2 - f) - 1)),
				g: i * (1 - s),
				b: i * (1 + s * ((3 * (1 - f)) / (2 - f) - 1))
			};
			break;
		default:
			res = { r: i * (1 - s), g: i * (1 - s), b: i * (1 - s) };
	}

	res.mode = 'rgb';
	if (alpha !== undefined) res.alpha = alpha;
	return res;
}
