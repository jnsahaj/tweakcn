const convertJchToJab = ({ j, c, h, alpha }) => {
	if (h === undefined) h = 0;
	let res = {
		mode: 'jab',
		j,
		a: c ? c * Math.cos((h / 180) * Math.PI) : 0,
		b: c ? c * Math.sin((h / 180) * Math.PI) : 0
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertJchToJab;
