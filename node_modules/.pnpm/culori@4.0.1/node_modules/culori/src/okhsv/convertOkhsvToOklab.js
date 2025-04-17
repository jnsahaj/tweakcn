/*
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

import convertOklabToLrgb from '../oklab/convertOklabToLrgb.js';
import { get_ST_max, toe_inv } from '../okhsl/helpers.js';

export default function convertOkhsvToOklab(hsv) {
	const ret = { mode: 'oklab' };
	if (hsv.alpha !== undefined) {
		ret.alpha = hsv.alpha;
	}

	const h = hsv.h !== undefined ? hsv.h : 0;
	const s = hsv.s !== undefined ? hsv.s : 0;
	const v = hsv.v !== undefined ? hsv.v : 0;

	const a_ = Math.cos((h / 180) * Math.PI);
	const b_ = Math.sin((h / 180) * Math.PI);

	const [S_max, T] = get_ST_max(a_, b_);
	const S_0 = 0.5;
	const k = 1 - S_0 / S_max;
	const L_v = 1 - (s * S_0) / (S_0 + T - T * k * s);
	const C_v = (s * T * S_0) / (S_0 + T - T * k * s);

	const L_vt = toe_inv(L_v);
	const C_vt = (C_v * L_vt) / L_v;
	const rgb_scale = convertOklabToLrgb({
		l: L_vt,
		a: a_ * C_vt,
		b: b_ * C_vt
	});
	const scale_L = Math.cbrt(
		1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0)
	);

	const L_new = toe_inv(v * L_v);
	const C = (C_v * L_new) / L_v;

	ret.l = L_new * scale_L;
	ret.a = C * a_ * scale_L;
	ret.b = C * b_ * scale_L;

	return ret;
}
