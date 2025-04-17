import converter from '../converter.js';
import { getMode } from '../modes.js';
import normalizePositions from '../util/normalizePositions.js';
import easingMidpoint from '../easing/midpoint.js';
import { mapper, mapAlphaMultiply, mapAlphaDivide } from '../map.js';

const isfn = o => typeof o === 'function';
const isobj = o => o && typeof o === 'object';
const isnum = o => typeof o === 'number';

const interpolate_fn = (colors, mode = 'rgb', overrides, premap) => {
	let def = getMode(mode);
	let conv = converter(mode);

	let conv_colors = [];
	let positions = [];
	let fns = {};

	colors.forEach(val => {
		if (Array.isArray(val)) {
			conv_colors.push(conv(val[0]));
			positions.push(val[1]);
		} else if (isnum(val) || isfn(val)) {
			// Color interpolation hint or easing function
			fns[positions.length] = val;
		} else {
			conv_colors.push(conv(val));
			positions.push(undefined);
		}
	});

	normalizePositions(positions);

	// override the default interpolators
	// from the color space definition with any custom ones
	let fixed = def.channels.reduce((res, ch) => {
		let ffn;
		if (isobj(overrides) && isobj(overrides[ch]) && overrides[ch].fixup) {
			ffn = overrides[ch].fixup;
		} else if (isobj(def.interpolate[ch]) && def.interpolate[ch].fixup) {
			ffn = def.interpolate[ch].fixup;
		} else {
			ffn = v => v;
		}
		res[ch] = ffn(conv_colors.map(color => color[ch]));
		return res;
	}, {});

	if (premap) {
		let ccolors = conv_colors.map((color, idx) => {
			return def.channels.reduce(
				(c, ch) => {
					c[ch] = fixed[ch][idx];
					return c;
				},
				{ mode }
			);
		});
		fixed = def.channels.reduce((res, ch) => {
			res[ch] = ccolors.map(c => {
				let v = premap(c[ch], ch, c, mode);
				return isNaN(v) ? undefined : v;
			});
			return res;
		}, {});
	}

	let interpolators = def.channels.reduce((res, ch) => {
		let ifn;
		if (isfn(overrides)) {
			ifn = overrides;
		} else if (isobj(overrides) && isfn(overrides[ch])) {
			ifn = overrides[ch];
		} else if (
			isobj(overrides) &&
			isobj(overrides[ch]) &&
			overrides[ch].use
		) {
			ifn = overrides[ch].use;
		} else if (isfn(def.interpolate[ch])) {
			ifn = def.interpolate[ch];
		} else if (isobj(def.interpolate[ch])) {
			ifn = def.interpolate[ch].use;
		}

		res[ch] = ifn(fixed[ch]);
		return res;
	}, {});

	let n = conv_colors.length - 1;

	return t => {
		// clamp t to the [0, 1] interval
		t = Math.min(Math.max(0, t), 1);

		if (t <= positions[0]) {
			return conv_colors[0];
		}

		if (t > positions[n]) {
			return conv_colors[n];
		}

		// Convert `t` from [0, 1] to `t0` between the appropriate two colors.
		// First, look for the two colors between which `t` is located.
		// Note: this can be optimized by searching for the index
		// through bisection instead of start-to-end.
		let idx = 0;
		while (positions[idx] < t) idx++;
		let start = positions[idx - 1];
		let delta = positions[idx] - start;

		let P = (t - start) / delta;

		// use either the local easing, or the global easing, if any
		let fn = fns[idx] || fns[0];
		if (fn !== undefined) {
			if (isnum(fn)) {
				fn = easingMidpoint((fn - start) / delta);
			}
			P = fn(P);
		}

		let t0 = (idx - 1 + P) / n;

		return def.channels.reduce(
			(res, channel) => {
				let val = interpolators[channel](t0);
				if (val !== undefined) {
					res[channel] = val;
				}
				return res;
			},
			{ mode }
		);
	};
};

const interpolate = (colors, mode = 'rgb', overrides) =>
	interpolate_fn(colors, mode, overrides);

const interpolateWith =
	(premap, postmap) =>
	(colors, mode = 'rgb', overrides) => {
		let post = postmap ? mapper(postmap, mode) : undefined;
		let it = interpolate_fn(colors, mode, overrides, premap);
		return post ? t => post(it(t)) : it;
	};

const interpolateWithPremultipliedAlpha = interpolateWith(
	mapAlphaMultiply,
	mapAlphaDivide
);

export { interpolate, interpolateWith, interpolateWithPremultipliedAlpha };
