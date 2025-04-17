import { YW } from '../hdr/constants.js';
import { transferPqEncode } from '../hdr/transfer.js';

const toAbs = (c = 0) => Math.max(c * YW, 0);

const convertXyz65ToItp = ({ x, y, z, alpha }) => {
	const absX = toAbs(x);
	const absY = toAbs(y);
	const absZ = toAbs(z);
	const l = transferPqEncode(
		0.3592832590121217 * absX +
			0.6976051147779502 * absY -
			0.0358915932320289 * absZ
	);
	const m = transferPqEncode(
		-0.1920808463704995 * absX +
			1.1004767970374323 * absY +
			0.0753748658519118 * absZ
	);
	const s = transferPqEncode(
		0.0070797844607477 * absX +
			0.0748396662186366 * absY +
			0.8433265453898765 * absZ
	);

	const i = 0.5 * l + 0.5 * m;
	const t = 1.61376953125 * l - 3.323486328125 * m + 1.709716796875 * s;
	const p = 4.378173828125 * l - 4.24560546875 * m - 0.132568359375 * s;

	const res = { mode: 'itp', i, t, p };
	if (alpha !== undefined) {
		res.alpha = alpha;
	}

	return res;
};

export default convertXyz65ToItp;
