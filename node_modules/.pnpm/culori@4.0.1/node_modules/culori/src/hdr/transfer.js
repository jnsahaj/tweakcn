/*
	https://en.wikipedia.org/wiki/Transfer_functions_in_imaging
*/

export const M1 = 0.1593017578125;
export const M2 = 78.84375;
export const C1 = 0.8359375;
export const C2 = 18.8515625;
export const C3 = 18.6875;

/*
	Perceptual Quantizer, as defined in Rec. BT 2100-2 (2018)

	* https://www.itu.int/rec/R-REC-BT.2100-2-201807-I/en
	* https://en.wikipedia.org/wiki/Perceptual_quantizer
*/

/* PQ EOTF, defined for `v` in [0,1]. */
export function transferPqDecode(v) {
	if (v < 0) return 0;
	const c = Math.pow(v, 1 / M2);
	return 1e4 * Math.pow(Math.max(0, c - C1) / (C2 - C3 * c), 1 / M1);
}

/* PQ EOTF^-1, defined for `v` in [0, 1e4]. */
export function transferPqEncode(v) {
	if (v < 0) return 0;
	const c = Math.pow(v / 1e4, M1);
	return Math.pow((C1 + C2 * c) / (1 + C3 * c), M2);
}
