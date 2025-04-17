import converter from './converter.js';

/*
	WCAG luminance
	References: 

	https://en.wikipedia.org/wiki/Relative_luminance
	https://github.com/w3c/wcag/issues/236#issuecomment-379526596
 */
export function luminance(color) {
	let c = converter('lrgb')(color);
	return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

/*
	WCAG contrast
 */
export function contrast(a, b) {
	let L1 = luminance(a);
	let L2 = luminance(b);
	return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}
