import gamma from './easing/gamma.js';

const samples = (n = 2, γ = 1) => {
	let ease = gamma(γ);
	if (n < 2) {
		return n < 1 ? [] : [ease(0.5)];
	}
	let res = [];
	for (let i = 0; i < n; i++) {
		res.push(ease(i / (n - 1)));
	}
	return res;
};

export default samples;
