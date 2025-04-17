import { interpolatorLinear } from '../interpolate/linear.js';
import { fixupAlpha } from '../fixup/alpha.js';
import convertItpToXyz65 from './convertItpToXyz65.js';
import convertXyz65ToItp from './convertXyz65ToItp.js';
import convertRgbToXyz65 from '../xyz65/convertRgbToXyz65.js';
import convertXyz65ToRgb from '../xyz65/convertXyz65ToRgb.js';

/*
  ICtCp (or ITP) color space, as defined in ITU-R Recommendation BT.2100.

  ICtCp is drafted to be supported in CSS within
  [CSS Color HDR Module Level 1](https://drafts.csswg.org/css-color-hdr/#ICtCp) spec.
*/

const definition = {
	mode: 'itp',
	channels: ['i', 't', 'p', 'alpha'],
	parse: ['--ictcp'],
	serialize: '--ictcp',

	toMode: {
		xyz65: convertItpToXyz65,
		rgb: color => convertXyz65ToRgb(convertItpToXyz65(color))
	},

	fromMode: {
		xyz65: convertXyz65ToItp,
		rgb: color => convertXyz65ToItp(convertRgbToXyz65(color))
	},

	ranges: {
		i: [0, 0.581],
		t: [-0.369, 0.272],
		p: [-0.164, 0.331]
	},

	interpolate: {
		i: interpolatorLinear,
		t: interpolatorLinear,
		p: interpolatorLinear,
		alpha: { use: interpolatorLinear, fixup: fixupAlpha }
	}
};

export default definition;
