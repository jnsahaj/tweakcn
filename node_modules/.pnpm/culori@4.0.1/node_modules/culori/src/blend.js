/*
	Color blend modes, as defined in the 
	CSS Compositing Level 4 spec

	https://drafts.fxtf.org/compositing-2/
	https://en.wikipedia.org/wiki/Blend_modes
	https://en.wikipedia.org/wiki/Alpha_compositing
	https://keithp.com/~keithp/porterduff/p253-porter.pdf
 */

import converter from './converter.js';
import { getMode } from './modes.js';

const BLENDS = {
	normal: (b, s) => s,
	multiply: (b, s) => b * s,
	screen: (b, s) => b + s - b * s,
	'hard-light': (b, s) => (s < 0.5 ? b * 2 * s : 2 * s * (1 - b) - 1),
	overlay: (b, s) => (b < 0.5 ? s * 2 * b : 2 * b * (1 - s) - 1),
	darken: (b, s) => Math.min(b, s),
	lighten: (b, s) => Math.max(b, s),
	'color-dodge': (b, s) =>
		b === 0 ? 0 : s === 1 ? 1 : Math.min(1, b / (1 - s)),
	'color-burn': (b, s) =>
		b === 1 ? 1 : s === 0 ? 0 : 1 - Math.min(1, (1 - b) / s),
	'soft-light': (b, s) =>
		s < 0.5
			? b - (1 - 2 * s) * b * (1 - b)
			: b +
			  (2 * s - 1) *
					((b < 0.25 ? ((16 * b - 12) * b + 4) * b : Math.sqrt(b)) -
						b),
	difference: (b, s) => Math.abs(b - s),
	exclusion: (b, s) => b + s - 2 * b * s
};

const blend = (colors, type = 'normal', mode = 'rgb') => {
	let fn = typeof type === 'function' ? type : BLENDS[type];

	let conv = converter(mode);

	// get mode channels
	let channels = getMode(mode).channels;

	// convert all colors to the mode
	// and assume undefined alphas are 1
	let converted = colors.map(c => {
		let cc = conv(c);
		if (cc.alpha === undefined) {
			cc.alpha = 1;
		}
		return cc;
	});

	return converted.reduce((b, s) => {
		if (b === undefined) return s;
		// blend backdrop and source
		let alpha = s.alpha + b.alpha * (1 - s.alpha);
		return channels.reduce(
			(res, ch) => {
				if (ch !== 'alpha') {
					if (alpha === 0) {
						res[ch] = 0;
					} else {
						res[ch] =
							s.alpha * (1 - b.alpha) * s[ch] +
							s.alpha * b.alpha * fn(b[ch], s[ch]) +
							(1 - s.alpha) * b.alpha * b[ch];
						// TODO fix() assumes [0, 1] colors
						// and is only true for RGB / LRGB
						res[ch] = Math.max(0, Math.min(1, res[ch] / alpha));
					}
				}
				return res;
			},
			{ mode, alpha }
		);
	});
};

export default blend;
