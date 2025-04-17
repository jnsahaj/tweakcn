/*
	Convert a RGB color to the Cubehelix HSL color space.

	This computation is not present in Green's paper:
	https://arxiv.org/pdf/1108.5083.pdf

	...but can be derived from the inverse, HSL to RGB conversion.

	It matches the math in Mike Bostock's D3 implementation:

	https://github.com/d3/d3-color/blob/master/src/cubehelix.js
 */

import { radToDeg, M } from './constants.js';

let DE = M[3] * M[4];
let BE = M[1] * M[4];
let BCAD = M[1] * M[2] - M[0] * M[3];

const convertRgbToCubehelix = ({ r, g, b, alpha }) => {
	if (r === undefined) r = 0;
	if (g === undefined) g = 0;
	if (b === undefined) b = 0;
	let l = (BCAD * b + r * DE - g * BE) / (BCAD + DE - BE);
	let x = b - l;
	let y = (M[4] * (g - l) - M[2] * x) / M[3];

	let res = {
		mode: 'cubehelix',
		l: l,
		s:
			l === 0 || l === 1
				? undefined
				: Math.sqrt(x * x + y * y) / (M[4] * l * (1 - l))
	};

	if (res.s) res.h = Math.atan2(y, x) * radToDeg - 120;
	if (alpha !== undefined) res.alpha = alpha;

	return res;
};

export default convertRgbToCubehelix;
