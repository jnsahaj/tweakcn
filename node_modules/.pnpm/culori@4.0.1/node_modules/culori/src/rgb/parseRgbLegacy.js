import { num, per, num_per, c } from '../util/regex.js';

/*
	rgb() regular expressions for legacy format
	Reference: https://drafts.csswg.org/css-color/#rgb-functions
 */
const rgb_num_old = new RegExp(
	`^rgba?\\(\\s*${num}${c}${num}${c}${num}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
);

const rgb_per_old = new RegExp(
	`^rgba?\\(\\s*${per}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
);

const parseRgbLegacy = color => {
	let res = { mode: 'rgb' };
	let match;
	if ((match = color.match(rgb_num_old))) {
		if (match[1] !== undefined) {
			res.r = match[1] / 255;
		}
		if (match[2] !== undefined) {
			res.g = match[2] / 255;
		}
		if (match[3] !== undefined) {
			res.b = match[3] / 255;
		}
	} else if ((match = color.match(rgb_per_old))) {
		if (match[1] !== undefined) {
			res.r = match[1] / 100;
		}
		if (match[2] !== undefined) {
			res.g = match[2] / 100;
		}
		if (match[3] !== undefined) {
			res.b = match[3] / 100;
		}
	} else {
		return undefined;
	}

	if (match[4] !== undefined) {
		res.alpha = Math.max(0, Math.min(1, match[4] / 100));
	} else if (match[5] !== undefined) {
		res.alpha = Math.max(0, Math.min(1, +match[5]));
	}

	return res;
};

export default parseRgbLegacy;
