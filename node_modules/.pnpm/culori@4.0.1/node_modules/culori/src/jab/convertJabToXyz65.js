import { M1 as n, C1, C2, C3 } from '../hdr/transfer.js';
const p = 134.03437499999998; // = 1.7 * 2523 / Math.pow(2, 5);
const d0 = 1.6295499532821566e-11;

/* 
	The encoding function is derived from Perceptual Quantizer.
*/
const jabPqDecode = v => {
	if (v < 0) return 0;
	let vp = Math.pow(v, 1 / p);
	return 10000 * Math.pow((C1 - vp) / (C3 * vp - C2), 1 / n);
};

const rel = v => v / 203;

const convertJabToXyz65 = ({ j, a, b, alpha }) => {
	if (j === undefined) j = 0;
	if (a === undefined) a = 0;
	if (b === undefined) b = 0;
	let i = (j + d0) / (0.44 + 0.56 * (j + d0));

	let l = jabPqDecode(i + 0.13860504 * a + 0.058047316 * b);
	let m = jabPqDecode(i - 0.13860504 * a - 0.058047316 * b);
	let s = jabPqDecode(i - 0.096019242 * a - 0.8118919 * b);

	let res = {
		mode: 'xyz65',
		x: rel(
			1.661373024652174 * l -
				0.914523081304348 * m +
				0.23136208173913045 * s
		),
		y: rel(
			-0.3250758611844533 * l +
				1.571847026732543 * m -
				0.21825383453227928 * s
		),
		z: rel(-0.090982811 * l - 0.31272829 * m + 1.5227666 * s)
	};

	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertJabToXyz65;
