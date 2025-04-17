const parseNumber = (color, len) => {
	if (typeof color !== 'number') return;

	// hex3: #c93 -> #cc9933
	if (len === 3) {
		return {
			mode: 'rgb',
			r: (((color >> 8) & 0xf) | ((color >> 4) & 0xf0)) / 255,
			g: (((color >> 4) & 0xf) | (color & 0xf0)) / 255,
			b: ((color & 0xf) | ((color << 4) & 0xf0)) / 255
		};
	}

	// hex4: #c931 -> #cc993311
	if (len === 4) {
		return {
			mode: 'rgb',
			r: (((color >> 12) & 0xf) | ((color >> 8) & 0xf0)) / 255,
			g: (((color >> 8) & 0xf) | ((color >> 4) & 0xf0)) / 255,
			b: (((color >> 4) & 0xf) | (color & 0xf0)) / 255,
			alpha: ((color & 0xf) | ((color << 4) & 0xf0)) / 255
		};
	}

	// hex6: #f0f1f2
	if (len === 6) {
		return {
			mode: 'rgb',
			r: ((color >> 16) & 0xff) / 255,
			g: ((color >> 8) & 0xff) / 255,
			b: (color & 0xff) / 255
		};
	}

	// hex8: #f0f1f2ff
	if (len === 8) {
		return {
			mode: 'rgb',
			r: ((color >> 24) & 0xff) / 255,
			g: ((color >> 16) & 0xff) / 255,
			b: ((color >> 8) & 0xff) / 255,
			alpha: (color & 0xff) / 255
		};
	}
};

export default parseNumber;
