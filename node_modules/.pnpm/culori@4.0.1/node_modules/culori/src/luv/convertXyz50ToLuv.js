import { k, e } from '../xyz50/constants.js';
import { D50 } from '../constants.js';

export const u_fn = (x, y, z) => (4 * x) / (x + 15 * y + 3 * z);
export const v_fn = (x, y, z) => (9 * y) / (x + 15 * y + 3 * z);

export const un = u_fn(D50.X, D50.Y, D50.Z);
export const vn = v_fn(D50.X, D50.Y, D50.Z);

const l_fn = value => (value <= e ? k * value : 116 * Math.cbrt(value) - 16);

const convertXyz50ToLuv = ({ x, y, z, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (z === undefined) z = 0;
	let l = l_fn(y / D50.Y);
	let u = u_fn(x, y, z);
	let v = v_fn(x, y, z);

	// guard against NaNs produced by `xyz(0 0 0)` black
	if (!isFinite(u) || !isFinite(v)) {
		l = u = v = 0;
	} else {
		u = 13 * l * (u - un);
		v = 13 * l * (v - vn);
	}

	let res = {
		mode: 'luv',
		l,
		u,
		v
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertXyz50ToLuv;
