const fn = (c = 0) => {
	const abs = Math.abs(c);
	if (abs > 0.0031308) {
		return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
	}
	return c * 12.92;
};

const convertLrgbToRgb = ({ r, g, b, alpha }, mode = 'rgb') => {
	let res = {
		mode,
		r: fn(r),
		g: fn(g),
		b: fn(b)
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertLrgbToRgb;
