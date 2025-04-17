import convertLrgbToRgb from '../lrgb/convertLrgbToRgb.js';
import { bias, bias_cbrt } from './constants.js';

const transfer = v => Math.pow(v + bias_cbrt, 3);

const convertXybToRgb = ({ x, y, b, alpha }) => {
	if (x === undefined) x = 0;
	if (y === undefined) y = 0;
	if (b === undefined) b = 0;
	const l = transfer(x + y) - bias;
	const m = transfer(y - x) - bias;
	/* Account for chroma from luma: add Y back to B */
	const s = transfer(b + y) - bias;

	const res = convertLrgbToRgb({
		r:
			11.031566904639861 * l -
			9.866943908131562 * m -
			0.16462299650829934 * s,
		g:
			-3.2541473810744237 * l +
			4.418770377582723 * m -
			0.16462299650829934 * s,
		b:
			-3.6588512867136815 * l +
			2.7129230459360922 * m +
			1.9459282407775895 * s
	});
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertXybToRgb;
