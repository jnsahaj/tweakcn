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
import { get_Cs, toe } from './helpers.js';

export default function convertOklabToOkhsl(lab) {
	const l = lab.l !== undefined ? lab.l : 0;
	const a = lab.a !== undefined ? lab.a : 0;
	const b = lab.b !== undefined ? lab.b : 0;

	const ret = { mode: 'okhsl', l: toe(l) };

	if (lab.alpha !== undefined) {
		ret.alpha = lab.alpha;
	}
	let c = Math.sqrt(a * a + b * b);
	if (!c) {
		ret.s = 0;
		return ret;
	}
	let [C_0, C_mid, C_max] = get_Cs(l, a / c, b / c);
	let s;
	if (c < C_mid) {
		let k_0 = 0;
		let k_1 = 0.8 * C_0;
		let k_2 = 1 - k_1 / C_mid;
		let t = (c - k_0) / (k_1 + k_2 * (c - k_0));
		s = t * 0.8;
	} else {
		let k_0 = C_mid;
		let k_1 = (0.2 * C_mid * C_mid * 1.25 * 1.25) / C_0;
		let k_2 = 1 - k_1 / (C_max - C_mid);
		let t = (c - k_0) / (k_1 + k_2 * (c - k_0));
		s = 0.8 + 0.2 * t;
	}
	if (s) {
		ret.s = s;
		ret.h = normalizeHue((Math.atan2(b, a) * 180) / Math.PI);
	}
	return ret;
}
