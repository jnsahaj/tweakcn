const convertYiqToRgb = ({ y, i, q, alpha }) => {
	if (y === undefined) y = 0;
	if (i === undefined) i = 0;
	if (q === undefined) q = 0;
	const res = {
		mode: 'rgb',
		r: y + 0.95608445 * i + 0.6208885 * q,
		g: y - 0.27137664 * i - 0.6486059 * q,
		b: y - 1.10561724 * i + 1.70250126 * q
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertYiqToRgb;
