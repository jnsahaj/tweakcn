// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation

export default function convertRgbToHsv({ r, g, b, alpha }) {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	let M = Math.max(r, g, b),
		m = Math.min(r, g, b);
	let res = {
		mode: 'hsv',
		s: M === 0 ? 0 : 1 - m / M,
		v: M
	};
	if (M - m !== 0)
		res.h =
			(M === r
				? (g - b) / (M - m) + (g < b) * 6
				: M === g
				? (b - r) / (M - m) + 2
				: (r - g) / (M - m) + 4) * 60;
	if (alpha !== undefined) res.alpha = alpha;
	return res;
}
