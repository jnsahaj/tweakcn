import { interpolatorLinear } from './linear.js';

/* 
	Monotone spline
	---------------

	Based on:

		Steffen, M.
		"A simple method for monotonic interpolation in one dimension."
		in Astronomy and Astrophysics, Vol. 239, p. 443-450 (Nov. 1990),
      	Provided by the SAO/NASA Astrophysics Data System.

		https://ui.adsabs.harvard.edu/abs/1990A&A...239..443S

	(Reference thanks to `d3/d3-shape`)
*/

const sgn = Math.sign;
const min = Math.min;
const abs = Math.abs;

const mono = arr => {
	let n = arr.length - 1;
	let s = [];
	let p = [];
	let yp = [];
	for (let i = 0; i < n; i++) {
		s.push((arr[i + 1] - arr[i]) * n);
		p.push(i > 0 ? 0.5 * (arr[i + 1] - arr[i - 1]) * n : undefined);
		yp.push(
			i > 0
				? (sgn(s[i - 1]) + sgn(s[i])) *
						min(abs(s[i - 1]), abs(s[i]), 0.5 * abs(p[i]))
				: undefined
		);
	}
	return [s, p, yp];
};

const interpolator = (arr, yp, s) => {
	let n = arr.length - 1;
	let n2 = n * n;
	return t => {
		let i;
		if (t >= 1) {
			i = n - 1;
		} else {
			i = Math.max(0, Math.floor(t * n));
		}
		let t1 = t - i / n;
		let t2 = t1 * t1;
		let t3 = t2 * t1;
		return (
			(yp[i] + yp[i + 1] - 2 * s[i]) * n2 * t3 +
			(3 * s[i] - 2 * yp[i] - yp[i + 1]) * n * t2 +
			yp[i] * t1 +
			arr[i]
		);
	};
};

/*
	A monotone spline which uses one-sided finite differences
	at the boundaries.
 */
export const interpolatorSplineMonotone = arr => {
	if (arr.length < 3) {
		return interpolatorLinear(arr);
	}
	let n = arr.length - 1;
	let [s, , yp] = mono(arr);
	yp[0] = s[0];
	yp[n] = s[n - 1];
	return interpolator(arr, yp, s);
};

/*
	The clamped monotone spline derives the values of y' 
	at the boundary points by tracing a parabola 
	through the first/last three points.

	For arrays of fewer than three values, we fall back to 
	linear interpolation.
 */

export const interpolatorSplineMonotone2 = arr => {
	if (arr.length < 3) {
		return interpolatorLinear(arr);
	}
	let n = arr.length - 1;
	let [s, p, yp] = mono(arr);
	p[0] = (arr[1] * 2 - arr[0] * 1.5 - arr[2] * 0.5) * n;
	p[n] = (arr[n] * 1.5 - arr[n - 1] * 2 + arr[n - 2] * 0.5) * n;
	yp[0] = p[0] * s[0] <= 0 ? 0 : abs(p[0]) > 2 * abs(s[0]) ? 2 * s[0] : p[0];
	yp[n] =
		p[n] * s[n - 1] <= 0
			? 0
			: abs(p[n]) > 2 * abs(s[n - 1])
			? 2 * s[n - 1]
			: p[n];
	return interpolator(arr, yp, s);
};

/*
	The closed monotone spline considers 
	the array to be periodic:

	arr[-1] = arr[arr.length - 1]
	arr[arr.length] = arr[0]

	...and so on.
 */
export const interpolatorSplineMonotoneClosed = arr => {
	let n = arr.length - 1;
	let [s, p, yp] = mono(arr);
	// boundary conditions
	p[0] = 0.5 * (arr[1] - arr[n]) * n;
	p[n] = 0.5 * (arr[0] - arr[n - 1]) * n;
	let s_m1 = (arr[0] - arr[n]) * n;
	let s_n = s_m1;
	yp[0] =
		(sgn(s_m1) + sgn(s[0])) * min(abs(s_m1), abs(s[0]), 0.5 * abs(p[0]));
	yp[n] =
		(sgn(s[n - 1]) + sgn(s_n)) *
		min(abs(s[n - 1]), abs(s_n), 0.5 * abs(p[n]));
	return interpolator(arr, yp, s);
};
