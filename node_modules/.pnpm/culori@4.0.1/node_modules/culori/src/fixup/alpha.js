const fixupAlpha = arr => {
	let some_defined = false;
	let res = arr.map(v => {
		if (v !== undefined) {
			some_defined = true;
			return v;
		}
		return 1;
	});
	return some_defined ? res : arr;
};

export { fixupAlpha };
