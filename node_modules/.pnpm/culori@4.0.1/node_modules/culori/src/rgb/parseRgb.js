import { Tok } from '../parse.js';

function parseRgb(color, parsed) {
	if (!parsed || (parsed[0] !== 'rgb' && parsed[0] !== 'rgba')) {
		return undefined;
	}
	const res = { mode: 'rgb' };
	const [, r, g, b, alpha] = parsed;
	if (r.type === Tok.Hue || g.type === Tok.Hue || b.type === Tok.Hue) {
		return undefined;
	}
	if (r.type !== Tok.None) {
		res.r = r.type === Tok.Number ? r.value / 255 : r.value / 100;
	}
	if (g.type !== Tok.None) {
		res.g = g.type === Tok.Number ? g.value / 255 : g.value / 100;
	}
	if (b.type !== Tok.None) {
		res.b = b.type === Tok.Number ? b.value / 255 : b.value / 100;
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

export default parseRgb;
