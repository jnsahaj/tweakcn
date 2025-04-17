import { M1 as n, C1, C2, C3 } from '../hdr/transfer.js';
const p = 134.03437499999998; // = 1.7 * 2523 / Math.pow(2, 5);
const d0 = 1.6295499532821566e-11;

/* 
	The encoding function is derived from Perceptual Quantizer.
*/
const jabPqEncode = v => {
	if (v < 0) return 0;
	let vn = Math.pow(v / 10000, n);
	return Math.pow((C1 + C2 * vn) / (1 + C3 * vn), p);
};

// Convert to Absolute XYZ
const abs = (v = 0) => Math.max(v * 203, 0);

const convertXyz65ToJab = ({ x, y, z, alpha }) => {
	x = abs(x);
	y = abs(y);
	z = abs(z);

	let xp = 1.15 * x - 0.15 * z;
	let yp = 0.66 * y + 0.34 * x;

	let l = jabPqEncode(0.41478972 * xp + 0.579999 * yp + 0.014648 * z);
	let m = jabPqEncode(-0.20151 * xp + 1.120649 * yp + 0.0531008 * z);
	let s = jabPqEncode(-0.0166008 * xp + 0.2648 * yp + 0.6684799 * z);

	let i = (l + m) / 2;

	let res = {
		mode: 'jab',
		j: (0.44 * i) / (1 - 0.56 * i) - d0,
		a: 3.524 * l - 4.066708 * m + 0.542708 * s,
		b: 0.199076 * l + 1.096799 * m - 1.295875 * s
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertXyz65ToJab;
