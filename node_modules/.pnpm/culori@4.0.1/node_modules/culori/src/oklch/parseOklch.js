import { Tok } from '../parse.js';

function parseOklch(color, parsed) {
	if (!parsed || parsed[0] !== 'oklch') {
		return undefined;
	}
	const res = { mode: 'oklch' };
	const [, l, c, h, alpha] = parsed;
	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) {
			return undefined;
		}
		res.l = Math.min(
			Math.max(0, l.type === Tok.Number ? l.value : l.value / 100),
			1
		);
	}
	if (c.type !== Tok.None) {
		res.c = Math.max(
			0,
			c.type === Tok.Number ? c.value : (c.value * 0.4) / 100
		);
	}
	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) {
			return undefined;
		}
		res.h = h.value;
	}
	if (alpha.type !== Tok.None) {
		res.alpha = Math.min(
			1,
			Math.max(
				0,
				alpha.type === Tok.Number ? alpha.value : alpha.value / 100
			)
		);
	}

	return res;
}

export default parseOklch;
