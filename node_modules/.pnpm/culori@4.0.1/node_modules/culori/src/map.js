import converter from './converter.js';
import prepare from './_prepare.js';
import { getMode } from './modes.js';

const mapper = (fn, mode = 'rgb', preserve_mode = false) => {
	let channels = mode ? getMode(mode).channels : null;
	let conv = mode ? converter(mode) : prepare;
	return color => {
		let conv_color = conv(color);
		if (!conv_color) {
			return undefined;
		}
		let res = (channels || getMode(conv_color.mode).channels).reduce(
			(res, ch) => {
				let v = fn(conv_color[ch], ch, conv_color, mode);
				if (v !== undefined && !isNaN(v)) {
					res[ch] = v;
				}
				return res;
			},
			{ mode: conv_color.mode }
		);
		if (!preserve_mode) {
			return res;
		}
		let prep = prepare(color);
		if (prep && prep.mode !== res.mode) {
			return converter(prep.mode)(res);
		}
		return res;
	};
};

const mapAlphaMultiply = (v, ch, c) => {
	if (ch !== 'alpha') {
		return (v || 0) * (c.alpha !== undefined ? c.alpha : 1);
	}
	return v;
};

const mapAlphaDivide = (v, ch, c) => {
	if (ch !== 'alpha' && c.alpha !== 0) {
		return (v || 0) / (c.alpha !== undefined ? c.alpha : 1);
	}
	return v;
};

const mapTransferLinear =
	(slope = 1, intercept = 0) =>
	(v, ch) => {
		if (ch !== 'alpha') {
			return v * slope + intercept;
		}
		return v;
	};

const mapTransferGamma =
	(amplitude = 1, exponent = 1, offset = 0) =>
	(v, ch) => {
		if (ch !== 'alpha') {
			return amplitude * Math.pow(v, exponent) + offset;
		}
		return v;
	};

export {
	mapper,
	mapAlphaMultiply,
	mapAlphaDivide,
	mapTransferLinear,
	mapTransferGamma
};
