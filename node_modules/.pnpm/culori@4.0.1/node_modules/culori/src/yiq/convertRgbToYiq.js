const convertRgbToYiq = ({ r, g, b, alpha }) => {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	const res = {
		mode: 'yiq',
		y: 0.29889531 * r + 0.58662247 * g + 0.11448223 * b,
		i: 0.59597799 * r - 0.2741761 * g - 0.32180189 * b,
		q: 0.21147017 * r - 0.52261711 * g + 0.31114694 * b
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertRgbToYiq;
