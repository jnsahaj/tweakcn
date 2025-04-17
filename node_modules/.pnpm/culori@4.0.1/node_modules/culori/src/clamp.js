import converter from './converter.js';
import prepare from './_prepare.js';
import { getMode } from './modes.js';
import { differenceEuclidean } from './difference.js';

const rgb = converter('rgb');
const fixup_rgb = c => {
	const res = {
		mode: c.mode,
		r: Math.max(0, Math.min(c.r !== undefined ? c.r : 0, 1)),
		g: Math.max(0, Math.min(c.g !== undefined ? c.g : 0, 1)),
		b: Math.max(0, Math.min(c.b !== undefined ? c.b : 0, 1))
	};
	if (c.alpha !== undefined) {
		res.alpha = c.alpha;
	}
	return res;
};

const to_displayable_srgb = c => fixup_rgb(rgb(c));

const inrange_rgb = c => {
	return (
		c !== undefined &&
		(c.r === undefined || (c.r >= 0 && c.r <= 1)) &&
		(c.g === undefined || (c.g >= 0 && c.g <= 1)) &&
		(c.b === undefined || (c.b >= 0 && c.b <= 1))
	);
};

/*
	Returns whether the color is in the sRGB gamut.
 */
export function displayable(color) {
	return inrange_rgb(rgb(color));
}

/*
	Given a color space `mode`, returns a function
	with which to check whether a color is 
	in that color space's gamut.
 */
export function inGamut(mode = 'rgb') {
	const { gamut } = getMode(mode);
	if (!gamut) {
		return color => true;
	}
	const conv = converter(typeof gamut === 'string' ? gamut : mode);
	return color => inrange_rgb(conv(color));
}

/*
	Obtain a color that's in the sRGB gamut
	by converting it to sRGB and clipping the channel values
	so that they're within the [0, 1] range.

	The result is returned in the color's original color space.
 */
export function clampRgb(color) {
	color = prepare(color);

	// if the color is undefined or displayable, return it directly
	if (color === undefined || displayable(color)) return color;

	// keep track of color's original mode
	let conv = converter(color.mode);

	return conv(to_displayable_srgb(color));
}

/*
	Given the `mode` color space, returns a function
	with which to obtain a color that's in gamut for
	the `mode` color space by clipping the channel values
	so that they fit in their respective ranges.

	It's similar to `clampRgb`, but works for any 
	bounded color space (RGB or not) for which 
	any combination of in-range channel values
	produces an in-gamut color.
 */
export function clampGamut(mode = 'rgb') {
	const { gamut } = getMode(mode);
	if (!gamut) {
		return color => prepare(color);
	}
	const destMode = typeof gamut === 'string' ? gamut : mode;
	const destConv = converter(destMode);
	const inDestGamut = inGamut(destMode);
	return color => {
		const original = prepare(color);
		if (!original) {
			return undefined;
		}
		const converted = destConv(original);
		if (inDestGamut(converted)) {
			return original;
		}
		const clamped = fixup_rgb(converted);
		if (original.mode === clamped.mode) {
			return clamped;
		}
		return converter(original.mode)(clamped);
	};
}

/*
	Obtain a color that’s in a RGB gamut (by default sRGB)
	by first converting it to `mode` and then finding 
	the greatest chroma value that fits the gamut.

	By default, the CIELCh color space is used,
	but any color that has a chroma component will do.

	The result is returned in the color's original color space.
 */
export function clampChroma(color, mode = 'lch', rgbGamut = 'rgb') {
	color = prepare(color);

	let inDestinationGamut =
		rgbGamut === 'rgb' ? displayable : inGamut(rgbGamut);
	let clipToGamut =
		rgbGamut === 'rgb' ? to_displayable_srgb : clampGamut(rgbGamut);

	// if the color is undefined or displayable, return it directly
	if (color === undefined || inDestinationGamut(color)) return color;

	// keep track of color's original mode
	let conv = converter(color.mode);

	// convert to the provided `mode` for clamping
	color = converter(mode)(color);

	// try with chroma = 0
	let clamped = { ...color, c: 0 };

	// if not even chroma = 0 is displayable
	// fall back to RGB clamping
	if (!inDestinationGamut(clamped)) {
		return conv(clipToGamut(clamped));
	}

	// By this time we know chroma = 0 is displayable and our current chroma is not.
	// Find the displayable chroma through the bisection method.
	let start = 0;
	let end = color.c !== undefined ? color.c : 0;
	let range = getMode(mode).ranges.c;
	let resolution = (range[1] - range[0]) / Math.pow(2, 13);
	let _last_good_c = clamped.c;

	while (end - start > resolution) {
		clamped.c = start + (end - start) * 0.5;
		if (inDestinationGamut(clamped)) {
			_last_good_c = clamped.c;
			start = clamped.c;
		} else {
			end = clamped.c;
		}
	}

	return conv(
		inDestinationGamut(clamped) ? clamped : { ...clamped, c: _last_good_c }
	);
}

/*
	Obtain a color that's in the `dest` gamut,
	by first converting it to the `mode` color space
	and then finding the largest chroma that's in gamut,
	similar to `clampChroma`. 

	The color returned is in the `dest` color space.

	To address the shortcomings of `clampChroma`, which can
	sometimes produce colors more desaturated than necessary,
	the test used in the binary search is replaced with
	"is color is roughly in gamut", by comparing the candidate 
	to the clipped version (obtained with `clampGamut`).
	The test passes if the colors are not too dissimilar, 
	judged by the `delta` color difference function 
	and an associated `jnd` just-noticeable difference value.

	The default arguments for this function correspond to the
	gamut mapping algorithm defined in CSS Color Level 4:
	https://drafts.csswg.org/css-color/#css-gamut-mapping

	To disable the “roughly in gamut” part, pass either
	`null` for the `delta` parameter, or zero for `jnd`.
 */
export function toGamut(
	dest = 'rgb',
	mode = 'oklch',
	delta = differenceEuclidean('oklch'),
	jnd = 0.02
) {
	const destConv = converter(dest);
	const destMode = getMode(dest);

	if (!destMode.gamut) {
		return color => destConv(color);
	}

	const inDestinationGamut = inGamut(dest);
	const clipToGamut = clampGamut(dest);

	const ucs = converter(mode);
	const { ranges } = getMode(mode);

	return color => {
		color = prepare(color);
		if (color === undefined) {
			return undefined;
		}
		const candidate = { ...ucs(color) };

		// account for missing components
		if (candidate.l === undefined) candidate.l = 0;
		if (candidate.c === undefined) candidate.c = 0;

		if (candidate.l >= ranges.l[1]) {
			const res = { ...destMode.white, mode: dest };
			if (color.alpha !== undefined) {
				res.alpha = color.alpha;
			}
			return res;
		}
		if (candidate.l <= ranges.l[0]) {
			const res = { ...destMode.black, mode: dest };
			if (color.alpha !== undefined) {
				res.alpha = color.alpha;
			}
			return res;
		}
		if (inDestinationGamut(candidate)) {
			return destConv(candidate);
		}
		let start = 0;
		let end = candidate.c;
		let epsilon = (ranges.c[1] - ranges.c[0]) / 4000; // 0.0001 for oklch()
		let clipped = clipToGamut(candidate);
		while (end - start > epsilon) {
			candidate.c = (start + end) * 0.5;
			clipped = clipToGamut(candidate);
			if (
				inDestinationGamut(candidate) ||
				(delta && jnd > 0 && delta(candidate, clipped) <= jnd)
			) {
				start = candidate.c;
			} else {
				end = candidate.c;
			}
		}
		return destConv(inDestinationGamut(candidate) ? candidate : clipped);
	};
}
