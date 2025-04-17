/*
	The XYZ tristimulus values (white point)
	of standard illuminants for the CIE 1931 2° 
	standard observer.

	See: https://en.wikipedia.org/wiki/Standard_illuminant
 */

export const D50 = {
	X: 0.3457 / 0.3585,
	Y: 1,
	Z: (1 - 0.3457 - 0.3585) / 0.3585
};

export const D65 = {
	X: 0.3127 / 0.329,
	Y: 1,
	Z: (1 - 0.3127 - 0.329) / 0.329
};

export const k = Math.pow(29, 3) / Math.pow(3, 3);
export const e = Math.pow(6, 3) / Math.pow(29, 3);
