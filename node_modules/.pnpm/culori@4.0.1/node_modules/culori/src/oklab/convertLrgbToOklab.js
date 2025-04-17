const convertLrgbToOklab = ({ r, g, b, alpha }) => {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	let L = Math.cbrt(
		0.41222147079999993 * r + 0.5363325363 * g + 0.0514459929 * b
	);
	let M = Math.cbrt(
		0.2119034981999999 * r + 0.6806995450999999 * g + 0.1073969566 * b
	);
	let S = Math.cbrt(
		0.08830246189999998 * r + 0.2817188376 * g + 0.6299787005000002 * b
	);

	let res = {
		mode: 'oklab',
		l: 0.2104542553 * L + 0.793617785 * M - 0.0040720468 * S,
		a: 1.9779984951 * L - 2.428592205 * M + 0.4505937099 * S,
		b: 0.0259040371 * L + 0.7827717662 * M - 0.808675766 * S
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertLrgbToOklab;
