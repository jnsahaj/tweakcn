import normalizeHue from '../util/normalizeHue.js';

const convertLuvToLchuv = ({ l, u, v, alpha }) => {
	if (u === undefined) u = 0;
	if (v === undefined) v = 0;
	let c = Math.sqrt(u * u + v * v);
	let res = {
		mode: 'lchuv',
		l: l,
		c: c
	};
	if (c) {
		res.h = normalizeHue((Math.atan2(v, u) * 180) / Math.PI);
	}
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertLuvToLchuv;
