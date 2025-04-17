import convertLab65ToXyz65 from './convertLab65ToXyz65.js';
import convertXyz65ToRgb from '../xyz65/convertXyz65ToRgb.js';

const convertLab65ToRgb = lab => convertXyz65ToRgb(convertLab65ToXyz65(lab));

export default convertLab65ToRgb;
