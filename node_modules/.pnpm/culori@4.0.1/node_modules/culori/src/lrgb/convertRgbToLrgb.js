const fn = (c = 0) => {
	const abs = Math.abs(c);
	if (abs <= 0.04045) {
		return c / 12.92;
	}
	return (Math.sign(c) || 1) * Math.pow((abs + 0.055) / 1.055, 2.4);
};

const convertRgbToLrgb = ({ r, g, b, alpha }) => {
	let res = {
		mode: 'lrgb',
		r: fn(r),
		g: fn(g),
		b: fn(b)
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertRgbToLrgb;
