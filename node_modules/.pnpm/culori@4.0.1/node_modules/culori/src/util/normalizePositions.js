/*
	Normalize an array of color stop positions for a gradient
	based on the rules defined in the CSS Images Module 4 spec:

	1. make the first position 0 and the last position 1 if missing
	2. sequences of unpositioned color stops should be spread out evenly
	3. no position can be smaller than any of the ones preceding it
	
	Reference: https://drafts.csswg.org/css-images-4/#color-stop-fixup

	Note: this method does not make a defensive copy of the array
	it receives as argument. Instead, it adjusts the values in-place.
 */
const normalizePositions = arr => {
	// 1. fix up first/last position if missing
	if (arr[0] === undefined) {
		arr[0] = 0;
	}
	if (arr[arr.length - 1] === undefined) {
		arr[arr.length - 1] = 1;
	}

	let i = 1;
	let j;
	let from_idx;
	let from_pos;
	let inc;
	while (i < arr.length) {
		// 2. fill up undefined positions
		if (arr[i] === undefined) {
			from_idx = i;
			from_pos = arr[i - 1];
			j = i;

			// find end of `undefined` sequence...
			while (arr[j] === undefined) j++;

			// ...and add evenly-spread positions
			inc = (arr[j] - from_pos) / (j - i + 1);
			while (i < j) {
				arr[i] = from_pos + (i + 1 - from_idx) * inc;
				i++;
			}
		} else if (arr[i] < arr[i - 1]) {
			// 3. make positions increase
			arr[i] = arr[i - 1];
		}
		i++;
	}
	return arr;
};

export default normalizePositions;
