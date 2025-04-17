import { mapper, mapTransferLinear } from './map.js';
import converter from './converter.js';
import prepare from './_prepare.js';
import { getMode } from './modes.js';

const minzero = v => Math.max(v, 0);
const clamp = v => Math.max(Math.min(v, 1), 0);
const lerp = (a, b, t) =>
	a === undefined || b === undefined ? undefined : a + t * (b - a);

const matrixSepia = amount => {
	let a = 1 - clamp(amount);
	return [
		0.393 + 0.607 * a,
		0.769 - 0.769 * a,
		0.189 - 0.189 * a,
		0,
		0.349 - 0.349 * a,
		0.686 + 0.314 * a,
		0.168 - 0.168 * a,
		0,
		0.272 - 0.272 * a,
		0.534 - 0.534 * a,
		0.131 + 0.869 * a,
		0,
		0,
		0,
		0,
		1
	];
};

const matrixSaturate = sat => {
	let s = minzero(sat);
	return [
		0.213 + 0.787 * s,
		0.715 - 0.715 * s,
		0.072 - 0.072 * s,
		0,
		0.213 - 0.213 * s,
		0.715 + 0.285 * s,
		0.072 - 0.072 * s,
		0,
		0.213 - 0.213 * s,
		0.715 - 0.715 * s,
		0.072 + 0.928 * s,
		0,
		0,
		0,
		0,
		1
	];
};

const matrixGrayscale = amount => {
	let a = 1 - clamp(amount);
	return [
		0.2126 + 0.7874 * a,
		0.7152 - 0.7152 * a,
		0.0722 - 0.0722 * a,
		0,
		0.2126 - 0.2126 * a,
		0.7152 + 0.2848 * a,
		0.0722 - 0.0722 * a,
		0,
		0.2126 - 0.2126 * a,
		0.7152 - 0.7152 * a,
		0.0722 + 0.9278 * a,
		0,
		0,
		0,
		0,
		1
	];
};

const matrixHueRotate = degrees => {
	let rad = (Math.PI * degrees) / 180;
	let c = Math.cos(rad);
	let s = Math.sin(rad);
	return [
		0.213 + c * 0.787 - s * 0.213,
		0.715 - c * 0.715 - s * 0.715,
		0.072 - c * 0.072 + s * 0.928,
		0,
		0.213 - c * 0.213 + s * 0.143,
		0.715 + c * 0.285 + s * 0.14,
		0.072 - c * 0.072 - s * 0.283,
		0,
		0.213 - c * 0.213 - s * 0.787,
		0.715 - c * 0.715 + s * 0.715,
		0.072 + c * 0.928 + s * 0.072,
		0,
		0,
		0,
		0,
		1
	];
};

const matrix = (values, mode, preserve_mode = false) => {
	let conv = converter(mode);
	let channels = getMode(mode).channels;
	return color => {
		let c = conv(color);
		if (!c) {
			return undefined;
		}
		let res = { mode };
		let ch;
		let count = channels.length;
		for (let i = 0; i < values.length; i++) {
			ch = channels[Math.floor(i / count)];
			if (c[ch] === undefined) {
				continue;
			}
			res[ch] =
				(res[ch] || 0) + values[i] * (c[channels[i % count]] || 0);
		}
		if (!preserve_mode) {
			return res;
		}
		let prep = prepare(color);
		return prep && res.mode !== prep.mode ? converter(prep.mode)(res) : res;
	};
};

const filterBrightness = (amt = 1, mode = 'rgb') => {
	let a = minzero(amt);
	return mapper(mapTransferLinear(a), mode, true);
};

const filterContrast = (amt = 1, mode = 'rgb') => {
	let a = minzero(amt);
	return mapper(mapTransferLinear(a, (1 - a) / 2), mode, true);
};
const filterSepia = (amt = 1, mode = 'rgb') =>
	matrix(matrixSepia(amt), mode, true);
const filterSaturate = (amt = 1, mode = 'rgb') =>
	matrix(matrixSaturate(amt), mode, true);
const filterGrayscale = (amt = 1, mode = 'rgb') =>
	matrix(matrixGrayscale(amt), mode, true);
const filterInvert = (amt = 1, mode = 'rgb') => {
	let a = clamp(amt);
	return mapper(
		(v, ch) => (ch === 'alpha' ? v : lerp(a, 1 - a, v)),
		mode,
		true
	);
};
const filterHueRotate = (deg = 0, mode = 'rgb') =>
	matrix(matrixHueRotate(deg), mode, true);

export {
	filterBrightness,
	filterContrast,
	filterSepia,
	filterSaturate,
	filterGrayscale,
	filterInvert,
	filterHueRotate
};
