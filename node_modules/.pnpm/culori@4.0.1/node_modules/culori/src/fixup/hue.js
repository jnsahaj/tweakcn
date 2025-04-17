import normalizeHue from '../util/normalizeHue.js';

const hue = (hues, fn) => {
	return hues
		.map((hue, idx, arr) => {
			if (hue === undefined) {
				return hue;
			}
			let normalized = normalizeHue(hue);
			if (idx === 0 || hues[idx - 1] === undefined) {
				return normalized;
			}
			return fn(normalized - normalizeHue(arr[idx - 1]));
		})
		.reduce((acc, curr) => {
			if (
				!acc.length ||
				curr === undefined ||
				acc[acc.length - 1] === undefined
			) {
				acc.push(curr);
				return acc;
			}
			acc.push(curr + acc[acc.length - 1]);
			return acc;
		}, []);
};

const fixupHueShorter = arr =>
	hue(arr, d => (Math.abs(d) <= 180 ? d : d - 360 * Math.sign(d)));
const fixupHueLonger = arr =>
	hue(arr, d => (Math.abs(d) >= 180 || d === 0 ? d : d - 360 * Math.sign(d)));
const fixupHueIncreasing = arr => hue(arr, d => (d >= 0 ? d : d + 360));
const fixupHueDecreasing = arr => hue(arr, d => (d <= 0 ? d : d - 360));

export {
	fixupHueShorter,
	fixupHueLonger,
	fixupHueIncreasing,
	fixupHueDecreasing
};
