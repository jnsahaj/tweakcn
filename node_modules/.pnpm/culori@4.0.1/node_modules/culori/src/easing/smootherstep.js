/*
	Smootherstep easing function proposed by K. Perlin
	Reference: https://en.wikipedia.org/wiki/Smoothstep
 */
const smootherstep = t => t * t * t * (t * (t * 6 - 15) + 10);

export default smootherstep;
