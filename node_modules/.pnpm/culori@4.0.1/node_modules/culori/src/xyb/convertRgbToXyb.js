import convertRgbToLrgb from '../lrgb/convertRgbToLrgb.js';
import { bias, bias_cbrt } from './constants.js';

const transfer = v => Math.cbrt(v) - bias_cbrt;

const convertRgbToXyb = color => {
	const { r, g, b, alpha } = convertRgbToLrgb(color);
	const l = transfer(0.3 * r + 0.622 * g + 0.078 * b + bias);
	const m = transfer(0.23 * r + 0.692 * g + 0.078 * b + bias);
	const s = transfer(
		0.24342268924547819 * r +
			0.20476744424496821 * g +
			0.5518098665095536 * b +
			bias
	);
	const res = {
		mode: 'xyb',
		x: (l - m) / 2,
		y: (l + m) / 2,
		/* Apply default chroma from luma (subtract Y from B) */
		b: s - (l + m) / 2
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertRgbToXyb;
