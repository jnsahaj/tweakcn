/*
	Adapted from code by Björn Ottosson,
	released under the MIT license:

	Copyright (c) 2021 Björn Ottosson

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is furnished to do
	so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
 */

import normalizeHue from '../util/normalizeHue.js';
import convertOklabToLrgb from '../oklab/convertOklabToLrgb.js';
import { get_ST_max, toe_inv, toe } from '../okhsl/helpers.js';

export default function convertOklabToOkhsv(lab) {
	let l = lab.l !== undefined ? lab.l : 0;
	let a = lab.a !== undefined ? lab.a : 0;
	let b = lab.b !== undefined ? lab.b : 0;

	let c = Math.sqrt(a * a + b * b);

	// TODO: c = 0
	let a_ = c ? a / c : 1;
	let b_ = c ? b / c : 1;

	let [S_max, T] = get_ST_max(a_, b_);
	let S_0 = 0.5;
	let k = 1 - S_0 / S_max;

	let t = T / (c + l * T);
	let L_v = t * l;
	let C_v = t * c;

	let L_vt = toe_inv(L_v);
	let C_vt = (C_v * L_vt) / L_v;

	let rgb_scale = convertOklabToLrgb({ l: L_vt, a: a_ * C_vt, b: b_ * C_vt });
	let scale_L = Math.cbrt(
		1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0)
	);

	l = l / scale_L;
	c = ((c / scale_L) * toe(l)) / l;
	l = toe(l);

	const ret = {
		mode: 'okhsv',
		s: c ? ((S_0 + T) * C_v) / (T * S_0 + T * k * C_v) : 0,
		v: l ? l / L_v : 0
	};
	if (ret.s) {
		ret.h = normalizeHue((Math.atan2(b, a) * 180) / Math.PI);
	}
	if (lab.alpha !== undefined) {
		ret.alpha = lab.alpha;
	}
	return ret;
}
