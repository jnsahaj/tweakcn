// Based on: https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation

export default function convertRgbToHsl({ r, g, b, alpha }) {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	let M = Math.max(r, g, b),
		m = Math.min(r, g, b);
	let res = {
		mode: 'hsl',
		s: M === m ? 0 : (M - m) / (1 - Math.abs(M + m - 1)),
		l: 0.5 * (M + m)
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
