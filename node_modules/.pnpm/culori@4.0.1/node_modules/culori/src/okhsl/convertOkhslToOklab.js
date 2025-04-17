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

import { toe_inv, get_Cs } from './helpers.js';

export default function convertOkhslToOklab(hsl) {
	let h = hsl.h !== undefined ? hsl.h : 0;
	let s = hsl.s !== undefined ? hsl.s : 0;
	let l = hsl.l !== undefined ? hsl.l : 0;

	const ret = { mode: 'oklab', l: toe_inv(l) };

	if (hsl.alpha !== undefined) {
		ret.alpha = hsl.alpha;
	}

	if (!s || l === 1) {
		ret.a = ret.b = 0;
		return ret;
	}

	let a_ = Math.cos((h / 180) * Math.PI);
	let b_ = Math.sin((h / 180) * Math.PI);
	let [C_0, C_mid, C_max] = get_Cs(ret.l, a_, b_);
	let t, k_0, k_1, k_2;
	if (s < 0.8) {
		t = 1.25 * s;
		k_0 = 0;
		k_1 = 0.8 * C_0;
		k_2 = 1 - k_1 / C_mid;
	} else {
		t = 5 * (s - 0.8);
		k_0 = C_mid;
		k_1 = (0.2 * C_mid * C_mid * 1.25 * 1.25) / C_0;
		k_2 = 1 - k_1 / (C_max - C_mid);
	}
	let C = k_0 + (t * k_1) / (1 - k_2 * t);
	ret.a = C * a_;
	ret.b = C * b_;

	return ret;
}
