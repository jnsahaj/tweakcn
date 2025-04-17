import { Tok } from '../parse.js';

function parseOklab(color, parsed) {
	if (!parsed || parsed[0] !== 'oklab') {
		return undefined;
	}
	const res = { mode: 'oklab' };
	const [, l, a, b, alpha] = parsed;
	if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) {
		return undefined;
	}
	if (l.type !== Tok.None) {
		res.l = Math.min(
			Math.max(0, l.type === Tok.Number ? l.value : l.value / 100),
			1
		);
	}
	if (a.type !== Tok.None) {
		res.a = a.type === Tok.Number ? a.value : (a.value * 0.4) / 100;
	}
	if (b.type !== Tok.None) {
		res.b = b.type === Tok.Number ? b.value : (b.value * 0.4) / 100;
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

export default parseOklab;
