import { k, e } from '../xyz65/constants.js';
import { D65 } from '../constants.js';

const f = value => (value > e ? Math.cbrt(value) : (k * value + 16) / 116);

const convertXyz65ToLab65 = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let f0 = f(x / D65.X);
	let f1 = f(y / D65.Y);
	let f2 = f(z / D65.Z);

	let res = {
		mode: 'lab65',
		l: 116 * f1 - 16,
		a: 500 * (f0 - f1),
		b: 200 * (f1 - f2)
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertXyz65ToLab65;
