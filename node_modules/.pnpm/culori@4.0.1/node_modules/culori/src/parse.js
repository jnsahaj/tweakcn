import { parsers, colorProfiles, getMode } from './modes.js';

/* eslint-disable-next-line no-control-regex */
const IdentStartCodePoint = /[^\x00-\x7F]|[a-zA-Z_]/;

/* eslint-disable-next-line no-control-regex */
const IdentCodePoint = /[^\x00-\x7F]|[-\w]/;

export const Tok = {
	Function: 'function',
	Ident: 'ident',
	Number: 'number',
	Percentage: 'percentage',
	ParenClose: ')',
	None: 'none',
	Hue: 'hue',
	Alpha: 'alpha'
};

let _i = 0;

/*
	4.3.10. Check if three code points would start a number
	https://drafts.csswg.org/css-syntax/#starts-with-a-number
 */
function is_num(chars) {
	let ch = chars[_i];
	let ch1 = chars[_i + 1];
	if (ch === '-' || ch === '+') {
		return /\d/.test(ch1) || (ch1 === '.' && /\d/.test(chars[_i + 2]));
	}
	if (ch === '.') {
		return /\d/.test(ch1);
	}
	return /\d/.test(ch);
}

/*
	Check if the stream starts with an identifier.
 */

function is_ident(chars) {
	if (_i >= chars.length) {
		return false;
	}
	let ch = chars[_i];
	if (IdentStartCodePoint.test(ch)) {
		return true;
	}
	if (ch === '-') {
		if (chars.length - _i < 2) {
			return false;
		}
		let ch1 = chars[_i + 1];
		if (ch1 === '-' || IdentStartCodePoint.test(ch1)) {
			return true;
		}
		return false;
	}
	return false;
}

/*
	4.3.3. Consume a numeric token
	https://drafts.csswg.org/css-syntax/#consume-numeric-token
 */

const huenits = {
	deg: 1,
	rad: 180 / Math.PI,
	grad: 9 / 10,
	turn: 360
};

function num(chars) {
	let value = '';
	if (chars[_i] === '-' || chars[_i] === '+') {
		value += chars[_i++];
	}
	value += digits(chars);
	if (chars[_i] === '.' && /\d/.test(chars[_i + 1])) {
		value += chars[_i++] + digits(chars);
	}
	if (chars[_i] === 'e' || chars[_i] === 'E') {
		if (
			(chars[_i + 1] === '-' || chars[_i + 1] === '+') &&
			/\d/.test(chars[_i + 2])
		) {
			value += chars[_i++] + chars[_i++] + digits(chars);
		} else if (/\d/.test(chars[_i + 1])) {
			value += chars[_i++] + digits(chars);
		}
	}
	if (is_ident(chars)) {
		let id = ident(chars);
		if (id === 'deg' || id === 'rad' || id === 'turn' || id === 'grad') {
			return { type: Tok.Hue, value: value * huenits[id] };
		}
		return undefined;
	}
	if (chars[_i] === '%') {
		_i++;
		return { type: Tok.Percentage, value: +value };
	}
	return { type: Tok.Number, value: +value };
}

/*
	Consume digits.
 */
function digits(chars) {
	let v = '';
	while (/\d/.test(chars[_i])) {
		v += chars[_i++];
	}
	return v;
}

/*
	Consume an identifier.
 */
function ident(chars) {
	let v = '';
	while (_i < chars.length && IdentCodePoint.test(chars[_i])) {
		v += chars[_i++];
	}
	return v;
}

/*
	Consume an ident-like token.
 */
function identlike(chars) {
	let v = ident(chars);
	if (chars[_i] === '(') {
		_i++;
		return { type: Tok.Function, value: v };
	}
	if (v === 'none') {
		return { type: Tok.None, value: undefined };
	}
	return { type: Tok.Ident, value: v };
}

export function tokenize(str = '') {
	let chars = str.trim();
	let tokens = [];
	let ch;

	/* reset counter */
	_i = 0;

	while (_i < chars.length) {
		ch = chars[_i++];

		/*
			Consume whitespace without emitting it
		 */
		if (ch === '\n' || ch === '\t' || ch === ' ') {
			while (
				_i < chars.length &&
				(chars[_i] === '\n' || chars[_i] === '\t' || chars[_i] === ' ')
			) {
				_i++;
			}
			continue;
		}

		if (ch === ',') {
			return undefined;
		}

		if (ch === ')') {
			tokens.push({ type: Tok.ParenClose });
			continue;
		}

		if (ch === '+') {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return undefined;
		}

		if (ch === '-') {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			if (is_ident(chars)) {
				tokens.push({ type: Tok.Ident, value: ident(chars) });
				continue;
			}
			return undefined;
		}

		if (ch === '.') {
			_i--;
			if (is_num(chars)) {
				tokens.push(num(chars));
				continue;
			}
			return undefined;
		}

		if (ch === '/') {
			while (
				_i < chars.length &&
				(chars[_i] === '\n' || chars[_i] === '\t' || chars[_i] === ' ')
			) {
				_i++;
			}
			let alpha;
			if (is_num(chars)) {
				alpha = num(chars);
				if (alpha.type !== Tok.Hue) {
					tokens.push({ type: Tok.Alpha, value: alpha });
					continue;
				}
			}
			if (is_ident(chars)) {
				if (ident(chars) === 'none') {
					tokens.push({
						type: Tok.Alpha,
						value: { type: Tok.None, value: undefined }
					});
					continue;
				}
			}
			return undefined;
		}

		if (/\d/.test(ch)) {
			_i--;
			tokens.push(num(chars));
			continue;
		}

		if (IdentStartCodePoint.test(ch)) {
			_i--;
			tokens.push(identlike(chars));
			continue;
		}

		/*
			Treat everything not already handled as an error.
		 */
		return undefined;
	}

	return tokens;
}

export function parseColorSyntax(tokens) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function || token.value !== 'color') {
		return undefined;
	}
	token = tokens[tokens._i++];
	if (token.type !== Tok.Ident) {
		return undefined;
	}
	const mode = colorProfiles[token.value];
	if (!mode) {
		return undefined;
	}
	const res = { mode };
	const coords = consumeCoords(tokens, false);
	if (!coords) {
		return undefined;
	}
	const channels = getMode(mode).channels;
	for (let ii = 0, c, ch; ii < channels.length; ii++) {
		c = coords[ii];
		ch = channels[ii];
		if (c.type !== Tok.None) {
			res[ch] = c.type === Tok.Number ? c.value : c.value / 100;
			if (ch === 'alpha') {
				res[ch] = Math.max(0, Math.min(1, res[ch]));
			}
		}
	}
	return res;
}

function consumeCoords(tokens, includeHue) {
	const coords = [];
	let token;
	while (tokens._i < tokens.length) {
		token = tokens[tokens._i++];
		if (
			token.type === Tok.None ||
			token.type === Tok.Number ||
			token.type === Tok.Alpha ||
			token.type === Tok.Percentage ||
			(includeHue && token.type === Tok.Hue)
		) {
			coords.push(token);
			continue;
		}
		if (token.type === Tok.ParenClose) {
			if (tokens._i < tokens.length) {
				return undefined;
			}
			continue;
		}
		return undefined;
	}

	if (coords.length < 3 || coords.length > 4) {
		return undefined;
	}

	if (coords.length === 4) {
		if (coords[3].type !== Tok.Alpha) {
			return undefined;
		}
		coords[3] = coords[3].value;
	}
	if (coords.length === 3) {
		coords.push({ type: Tok.None, value: undefined });
	}

	return coords.every(c => c.type !== Tok.Alpha) ? coords : undefined;
}

export function parseModernSyntax(tokens, includeHue) {
	tokens._i = 0;
	let token = tokens[tokens._i++];
	if (!token || token.type !== Tok.Function) {
		return undefined;
	}
	let coords = consumeCoords(tokens, includeHue);
	if (!coords) {
		return undefined;
	}
	coords.unshift(token.value);
	return coords;
}

const parse = color => {
	if (typeof color !== 'string') {
		return undefined;
	}
	const tokens = tokenize(color);
	const parsed = tokens ? parseModernSyntax(tokens, true) : undefined;
	let result = undefined;
	let i = 0;
	let len = parsers.length;
	while (i < len) {
		if ((result = parsers[i++](color, parsed)) !== undefined) {
			return result;
		}
	}
	return tokens ? parseColorSyntax(tokens) : undefined;
};

export default parse;
