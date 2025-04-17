import { differenceEuclidean } from './difference.js';

/*
	This works linearly right now, but we might get better performance
	with a V-P Tree (Vantage Point Tree). 

	Reference:
	* http://pnylab.com/papers/vptree/main.html
 */

const nearest = (colors, metric = differenceEuclidean(), accessor = d => d) => {
	let arr = colors.map((c, idx) => ({ color: accessor(c), i: idx }));
	return (color, n = 1, τ = Infinity) => {
		if (isFinite(n)) {
			n = Math.max(1, Math.min(n, arr.length - 1));
		}

		arr.forEach(c => {
			c.d = metric(color, c.color);
		});

		return arr
			.sort((a, b) => a.d - b.d)
			.slice(0, n)
			.filter(c => c.d < τ)
			.map(c => colors[c.i]);
	};
};

export default nearest;
