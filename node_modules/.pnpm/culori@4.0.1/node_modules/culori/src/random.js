import { getMode } from './modes.js';

/*
	Generate a random number between `min` and `max`
 */
const rand = ([min, max]) => min + Math.random() * (max - min);

/*
	Convert a constraints object to intervals.
 */
const to_intervals = constraints =>
	Object.keys(constraints).reduce((o, k) => {
		let v = constraints[k];
		o[k] = Array.isArray(v) ? v : [v, v];
		return o;
	}, {});

/*
	Generate a random color.
 */
const random = (mode = 'rgb', constraints = {}) => {
	let def = getMode(mode);
	let limits = to_intervals(constraints);
	return def.channels.reduce(
		(res, ch) => {
			// ignore alpha if not present in constraints
			if (limits.alpha || ch !== 'alpha') {
				res[ch] = rand(limits[ch] || def.ranges[ch]);
			}
			return res;
		},
		{ mode }
	);
};

export default random;
