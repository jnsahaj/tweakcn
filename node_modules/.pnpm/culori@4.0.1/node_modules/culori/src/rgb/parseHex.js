import parseNumber from './parseNumber.js';

const hex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;

const parseHex = color => {
	let match;
	// eslint-disable-next-line no-cond-assign
	return (match = color.match(hex))
		? parseNumber(parseInt(match[1], 16), match[1].length)
		: undefined;
};

export default parseHex;
