import { Tok } from '../parse.js';

function parseHsl(color, parsed) {
	if (!parsed || (parsed[0] !== 'hsl' && parsed[0] !== 'hsla')) {
		return undefined;
	}
	const res = { mode: 'hsl' };
	const [, h, s, l, alpha] = parsed;

	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) {
			return undefined;
		}
		res.h = h.value;
	}

	if (s.type !== Tok.None) {
		if (s.type === Tok.Hue) {
			return undefined;
		}
		res.s = s.value / 100;
	}

	if (l.type !== Tok.None) {
		if (l.type === Tok.Hue) {
			return undefined;
		}
		res.l = l.value / 100;
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

export default parseHsl;
