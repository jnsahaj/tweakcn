import { Tok } from '../parse.js';

function ParseHwb(color, parsed) {
	if (!parsed || parsed[0] !== 'hwb') {
		return undefined;
	}
	const res = { mode: 'hwb' };
	const [, h, w, b, alpha] = parsed;

	if (h.type !== Tok.None) {
		if (h.type === Tok.Percentage) {
			return undefined;
		}
		res.h = h.value;
	}

	if (w.type !== Tok.None) {
		if (w.type === Tok.Hue) {
			return undefined;
		}
		res.w = w.value / 100;
	}

	if (b.type !== Tok.None) {
		if (b.type === Tok.Hue) {
			return undefined;
		}
		res.b = b.value / 100;
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

export default ParseHwb;
