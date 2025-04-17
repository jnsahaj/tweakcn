const get_classes = arr => {
	let classes = [];
	for (let i = 0; i < arr.length - 1; i++) {
		let a = arr[i];
		let b = arr[i + 1];
		if (a === undefined && b === undefined) {
			classes.push(undefined);
		} else if (a !== undefined && b !== undefined) {
			classes.push([a, b]);
		} else {
			classes.push(a !== undefined ? [a, a] : [b, b]);
		}
	}
	return classes;
};

const interpolatorPiecewise = interpolator => arr => {
	let classes = get_classes(arr);
	return t => {
		let cls = t * classes.length;
		let idx = t >= 1 ? classes.length - 1 : Math.max(Math.floor(cls), 0);
		let pair = classes[idx];
		return pair === undefined
			? undefined
			: interpolator(pair[0], pair[1], cls - idx);
	};
};

export { interpolatorPiecewise };
