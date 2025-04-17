const lerp = (a, b, t) => a + t * (b - a);
const unlerp = (a, b, v) => (v - a) / (b - a);

const blerp = (a00, a01, a10, a11, tx, ty) => {
	return lerp(lerp(a00, a01, tx), lerp(a10, a11, tx), ty);
};

const trilerp = (
	a000,
	a010,
	a100,
	a110,
	a001,
	a011,
	a101,
	a111,
	tx,
	ty,
	tz
) => {
	return lerp(
		blerp(a000, a010, a100, a110, tx, ty),
		blerp(a001, a011, a101, a111, tx, ty),
		tz
	);
};

export { lerp, blerp, trilerp, unlerp };
