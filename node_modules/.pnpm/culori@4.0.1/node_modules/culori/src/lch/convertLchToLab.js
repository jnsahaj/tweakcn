/* 
	References: 
		* https://drafts.csswg.org/css-color/#lch-to-lab
		* https://drafts.csswg.org/css-color/#color-conversion-code
*/
const convertLchToLab = ({ l, c, h, alpha }, mode = 'lab') => {
	if (h === undefined) h = 0;
	let res = {
		mode,
		l,
		a: c ? c * Math.cos((h / 180) * Math.PI) : 0,
		b: c ? c * Math.sin((h / 180) * Math.PI) : 0
	};
	if (alpha !== undefined) res.alpha = alpha;
	return res;
};

export default convertLchToLab;
