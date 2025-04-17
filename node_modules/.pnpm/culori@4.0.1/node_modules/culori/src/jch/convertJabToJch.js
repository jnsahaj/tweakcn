import normalizeHue from '../util/normalizeHue.js';

const convertJabToJch = ({ j, a, b, alpha }) => {
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let c = Math.sqrt(a * a + b * b);
	let res = {
		mode: 'jch',
		j,
		c
	};
	if (c) {
		res.h = normalizeHue((Math.atan2(b, a) * 180) / Math.PI);
	}
	if (alpha !== undefined) {
		res.alpha = alpha;
	}
	return res;
};

export default convertJabToJch;
