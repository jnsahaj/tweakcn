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

import convertOklabToLrgb from '../oklab/convertOklabToLrgb.js';

export function toe(x) {
	const k_1 = 0.206;
	const k_2 = 0.03;
	const k_3 = (1 + k_1) / (1 + k_2);
	return (
		0.5 *
		(k_3 * x -
			k_1 +
			Math.sqrt((k_3 * x - k_1) * (k_3 * x - k_1) + 4 * k_2 * k_3 * x))
	);
}

export function toe_inv(x) {
	const k_1 = 0.206;
	const k_2 = 0.03;
	const k_3 = (1 + k_1) / (1 + k_2);
	return (x * x + k_1 * x) / (k_3 * (x + k_2));
}

// Finds the maximum saturation possible for a given hue that fits in sRGB
// Saturation here is defined as S = C/L
// a and b must be normalized so a^2 + b^2 == 1
function compute_max_saturation(a, b) {
	// Max saturation will be when one of r, g or b goes below zero.

	// Select different coefficients depending on which component goes below zero first
	let k0, k1, k2, k3, k4, wl, wm, ws;

	if (-1.88170328 * a - 0.80936493 * b > 1) {
		// Red component
		k0 = +1.19086277;
		k1 = +1.76576728;
		k2 = +0.59662641;
		k3 = +0.75515197;
		k4 = +0.56771245;
		wl = +4.0767416621;
		wm = -3.3077115913;
		ws = +0.2309699292;
	} else if (1.81444104 * a - 1.19445276 * b > 1) {
		// Green component
		k0 = +0.73956515;
		k1 = -0.45954404;
		k2 = +0.08285427;
		k3 = +0.1254107;
		k4 = +0.14503204;
		wl = -1.2684380046;
		wm = +2.6097574011;
		ws = -0.3413193965;
	} else {
		// Blue component
		k0 = +1.35733652;
		k1 = -0.00915799;
		k2 = -1.1513021;
		k3 = -0.50559606;
		k4 = +0.00692167;
		wl = -0.0041960863;
		wm = -0.7034186147;
		ws = +1.707614701;
	}

	// Approximate max saturation using a polynomial:
	let S = k0 + k1 * a + k2 * b + k3 * a * a + k4 * a * b;

	// Do one step Halley's method to get closer
	// this gives an error less than 10e6, except for some blue hues where the dS/dh is close to infinite
	// this should be sufficient for most applications, otherwise do two/three steps

	let k_l = +0.3963377774 * a + 0.2158037573 * b;
	let k_m = -0.1055613458 * a - 0.0638541728 * b;
	let k_s = -0.0894841775 * a - 1.291485548 * b;

	{
		let l_ = 1 + S * k_l;
		let m_ = 1 + S * k_m;
		let s_ = 1 + S * k_s;

		let l = l_ * l_ * l_;
		let m = m_ * m_ * m_;
		let s = s_ * s_ * s_;

		let l_dS = 3 * k_l * l_ * l_;
		let m_dS = 3 * k_m * m_ * m_;
		let s_dS = 3 * k_s * s_ * s_;

		let l_dS2 = 6 * k_l * k_l * l_;
		let m_dS2 = 6 * k_m * k_m * m_;
		let s_dS2 = 6 * k_s * k_s * s_;

		let f = wl * l + wm * m + ws * s;
		let f1 = wl * l_dS + wm * m_dS + ws * s_dS;
		let f2 = wl * l_dS2 + wm * m_dS2 + ws * s_dS2;

		S = S - (f * f1) / (f1 * f1 - 0.5 * f * f2);
	}

	return S;
}

export function find_cusp(a, b) {
	// First, find the maximum saturation (saturation S = C/L)
	let S_cusp = compute_max_saturation(a, b);

	// Convert to linear sRGB to find the first point where at least one of r,g or b >= 1:
	let rgb = convertOklabToLrgb({ l: 1, a: S_cusp * a, b: S_cusp * b });
	let L_cusp = Math.cbrt(1 / Math.max(rgb.r, rgb.g, rgb.b));
	let C_cusp = L_cusp * S_cusp;

	return [L_cusp, C_cusp];
}

// Finds intersection of the line defined by
// L = L0 * (1 - t) + t * L1;
// C = t * C1;
// a and b must be normalized so a^2 + b^2 == 1
function find_gamut_intersection(a, b, L1, C1, L0, cusp = null) {
	if (!cusp) {
		// Find the cusp of the gamut triangle
		cusp = find_cusp(a, b);
	}

	// Find the intersection for upper and lower half seprately
	let t;
	if ((L1 - L0) * cusp[1] - (cusp[0] - L0) * C1 <= 0) {
		// Lower half

		t = (cusp[1] * L0) / (C1 * cusp[0] + cusp[1] * (L0 - L1));
	} else {
		// Upper half

		// First intersect with triangle
		t = (cusp[1] * (L0 - 1)) / (C1 * (cusp[0] - 1) + cusp[1] * (L0 - L1));

		// Then one step Halley's method
		{
			let dL = L1 - L0;
			let dC = C1;

			let k_l = +0.3963377774 * a + 0.2158037573 * b;
			let k_m = -0.1055613458 * a - 0.0638541728 * b;
			let k_s = -0.0894841775 * a - 1.291485548 * b;

			let l_dt = dL + dC * k_l;
			let m_dt = dL + dC * k_m;
			let s_dt = dL + dC * k_s;

			// If higher accuracy is required, 2 or 3 iterations of the following block can be used:
			{
				let L = L0 * (1 - t) + t * L1;
				let C = t * C1;

				let l_ = L + C * k_l;
				let m_ = L + C * k_m;
				let s_ = L + C * k_s;

				let l = l_ * l_ * l_;
				let m = m_ * m_ * m_;
				let s = s_ * s_ * s_;

				let ldt = 3 * l_dt * l_ * l_;
				let mdt = 3 * m_dt * m_ * m_;
				let sdt = 3 * s_dt * s_ * s_;

				let ldt2 = 6 * l_dt * l_dt * l_;
				let mdt2 = 6 * m_dt * m_dt * m_;
				let sdt2 = 6 * s_dt * s_dt * s_;

				let r =
					4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s - 1;
				let r1 =
					4.0767416621 * ldt -
					3.3077115913 * mdt +
					0.2309699292 * sdt;
				let r2 =
					4.0767416621 * ldt2 -
					3.3077115913 * mdt2 +
					0.2309699292 * sdt2;

				let u_r = r1 / (r1 * r1 - 0.5 * r * r2);
				let t_r = -r * u_r;

				let g =
					-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s - 1;
				let g1 =
					-1.2684380046 * ldt +
					2.6097574011 * mdt -
					0.3413193965 * sdt;
				let g2 =
					-1.2684380046 * ldt2 +
					2.6097574011 * mdt2 -
					0.3413193965 * sdt2;

				let u_g = g1 / (g1 * g1 - 0.5 * g * g2);
				let t_g = -g * u_g;

				let b =
					-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s - 1;
				let b1 =
					-0.0041960863 * ldt -
					0.7034186147 * mdt +
					1.707614701 * sdt;
				let b2 =
					-0.0041960863 * ldt2 -
					0.7034186147 * mdt2 +
					1.707614701 * sdt2;

				let u_b = b1 / (b1 * b1 - 0.5 * b * b2);
				let t_b = -b * u_b;

				t_r = u_r >= 0 ? t_r : 10e5;
				t_g = u_g >= 0 ? t_g : 10e5;
				t_b = u_b >= 0 ? t_b : 10e5;

				t += Math.min(t_r, Math.min(t_g, t_b));
			}
		}
	}

	return t;
}

export function get_ST_max(a_, b_, cusp = null) {
	if (!cusp) {
		cusp = find_cusp(a_, b_);
	}
	let L = cusp[0];
	let C = cusp[1];
	return [C / L, C / (1 - L)];
}

export function get_ST_mid(a_, b_) {
	let S =
		0.11516993 +
		1 /
			(+7.4477897 +
				4.1590124 * b_ +
				a_ *
					(-2.19557347 +
						1.75198401 * b_ +
						a_ *
							(-2.13704948 -
								10.02301043 * b_ +
								a_ *
									(-4.24894561 +
										5.38770819 * b_ +
										4.69891013 * a_))));

	let T =
		0.11239642 +
		1 /
			(+1.6132032 -
				0.68124379 * b_ +
				a_ *
					(+0.40370612 +
						0.90148123 * b_ +
						a_ *
							(-0.27087943 +
								0.6122399 * b_ +
								a_ *
									(+0.00299215 -
										0.45399568 * b_ -
										0.14661872 * a_))));

	return [S, T];
}

export function get_Cs(L, a_, b_) {
	let cusp = find_cusp(a_, b_);

	let C_max = find_gamut_intersection(a_, b_, L, 1, L, cusp);
	let ST_max = get_ST_max(a_, b_, cusp);

	let S_mid =
		0.11516993 +
		1 /
			(+7.4477897 +
				4.1590124 * b_ +
				a_ *
					(-2.19557347 +
						1.75198401 * b_ +
						a_ *
							(-2.13704948 -
								10.02301043 * b_ +
								a_ *
									(-4.24894561 +
										5.38770819 * b_ +
										4.69891013 * a_))));

	let T_mid =
		0.11239642 +
		1 /
			(+1.6132032 -
				0.68124379 * b_ +
				a_ *
					(+0.40370612 +
						0.90148123 * b_ +
						a_ *
							(-0.27087943 +
								0.6122399 * b_ +
								a_ *
									(+0.00299215 -
										0.45399568 * b_ -
										0.14661872 * a_))));

	let k = C_max / Math.min(L * ST_max[0], (1 - L) * ST_max[1]);

	let C_a = L * S_mid;
	let C_b = (1 - L) * T_mid;
	let C_mid =
		0.9 *
		k *
		Math.sqrt(
			Math.sqrt(
				1 / (1 / (C_a * C_a * C_a * C_a) + 1 / (C_b * C_b * C_b * C_b))
			)
		);

	C_a = L * 0.4;
	C_b = (1 - L) * 0.8;
	let C_0 = Math.sqrt(1 / (1 / (C_a * C_a) + 1 / (C_b * C_b)));
	return [C_0, C_mid, C_max];
}
