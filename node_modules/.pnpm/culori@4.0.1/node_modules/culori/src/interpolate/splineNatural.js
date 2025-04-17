import {
	interpolatorSplineBasisClosed,
	interpolatorSplineBasis
} from './splineBasis.js';

const solve = v => {
	let i;
	let n = v.length - 1;
	let c = new Array(n);
	let _v = new Array(n);
	let sol = new Array(n);

	c[1] = 1 / 4;
	_v[1] = (6 * v[1] - v[0]) / 4;

	for (i = 2; i < n; ++i) {
		c[i] = 1 / (4 - c[i - 1]);
		_v[i] = (6 * v[i] - (i == n - 1 ? v[n] : 0) - _v[i - 1]) * c[i];
	}

	sol[0] = v[0];
	sol[n] = v[n];
	if (n - 1 > 0) {
		sol[n - 1] = _v[n - 1];
	}

	for (i = n - 2; i > 0; --i) {
		sol[i] = _v[i] - c[i] * sol[i + 1];
	}

	return sol;
};

export const interpolatorSplineNatural = arr =>
	interpolatorSplineBasis(solve(arr));
export const interpolatorSplineNaturalClosed = arr =>
	interpolatorSplineBasisClosed(solve(arr));
