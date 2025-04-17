import { k, e } from '../xyz65/constants.js';
import { D65 } from '../constants.js';

let fn = v => (Math.pow(v, 3) > e ? Math.pow(v, 3) : (116 * v - 16) / k);

const convertLab65ToXyz65 = ({ l, a, b, alpha }) => {
	if (l === undefined) l = 0;
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;

	let fy = (l + 16) / 116;
	let fx = a / 500 + fy;
	let fz = fy - b / 200;

	let res = {
		mode: 'xyz65',
		x: fn(fx) * D65.X,
		y: fn(fy) * D65.Y,
		z: fn(fz) * D65.Z
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertLab65ToXyz65;
