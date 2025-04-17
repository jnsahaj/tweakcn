const parseTransparent = c =>
	c === 'transparent'
		? { mode: 'rgb', r: 0, g: 0, b: 0, alpha: 0 }
		: undefined;

export default parseTransparent;
