import { k } from '../xyz50/constants.js';
import { D50 } from '../constants.js';

export const u_fn = (x, y, z) => (4 * x) / (x + 15 * y + 3 * z);
export const v_fn = (x, y, z) => (9 * y) / (x + 15 * y + 3 * z);

export const un = u_fn(D50.X, D50.Y, D50.Z);
export const vn = v_fn(D50.X, D50.Y, D50.Z);

const convertLuvToXyz50 = ({ l, u, v, alpha }) => {
	if (l === undefined) l = 0;
	if (l === 0) {
		return { mode: 'xyz50', x: 0, y: 0, z: 0 };
	}

	if (u === undefined) u = 0;
	if (v === undefined) v = 0;

	let up = u / (13 * l) + un;
	let vp = v / (13 * l) + vn;
	let y = D50.Y * (l <= 8 ? l / k : Math.pow((l + 16) / 116, 3));
	let x = (y * (9 * up)) / (4 * vp);
	let z = (y * (12 - 3 * up - 20 * vp)) / (4 * vp);

	let res = { mode: 'xyz50', x, y, z };
	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertLuvToXyz50;
