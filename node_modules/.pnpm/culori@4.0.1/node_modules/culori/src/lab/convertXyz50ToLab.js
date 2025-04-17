import { k, e } from '../xyz50/constants.js';
import { D50 } from '../constants.js';

const f = value => (value > e ? Math.cbrt(value) : (k * value + 16) / 116);

const convertXyz50ToLab = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let f0 = f(x / D50.X);
	let f1 = f(y / D50.Y);
	let f2 = f(z / D50.Z);

	let res = {
		mode: 'lab',
		l: 116 * f1 - 16,
		a: 500 * (f0 - f1),
		b: 200 * (f1 - f2)
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertXyz50ToLab;
