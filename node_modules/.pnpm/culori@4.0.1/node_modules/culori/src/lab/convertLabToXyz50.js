import { k, e } from '../xyz50/constants.js';
import { D50 } from '../constants.js';

let fn = v => (Math.pow(v, 3) > e ? Math.pow(v, 3) : (116 * v - 16) / k);

const convertLabToXyz50 = ({ l, a, b, alpha }) => {
	if (l === undefined) l = 0;
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let fy = (l + 16) / 116;
	let fx = a / 500 + fy;
	let fz = fy - b / 200;

	let res = {
		mode: 'xyz50',
		x: fn(fx) * D50.X,
		y: fn(fy) * D50.Y,
		z: fn(fz) * D50.Z
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertLabToXyz50;
