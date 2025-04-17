/*
	Smoothstep easing function and its inverse
	Reference: https://en.wikipedia.org/wiki/Smoothstep
 */
const easingSmoothstep = t => t * t * (3 - 2 * t);
const easingSmoothstepInverse = t => 0.5 - Math.sin(Math.asin(1 - 2 * t) / 3);

export { easingSmoothstep, easingSmoothstepInverse };
