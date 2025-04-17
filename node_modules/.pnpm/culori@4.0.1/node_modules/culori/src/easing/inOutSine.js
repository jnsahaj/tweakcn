/* 
	Sinusoidal (cosine) in-out easing
*/
const inOutSine = t => (1 - Math.cos(t * Math.PI)) / 2;

export default inOutSine;
