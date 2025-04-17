import convertXyz65ToRgb from '../xyz65/convertXyz65ToRgb.js';
import convertJabToXyz65 from './convertJabToXyz65.js';

const convertJabToRgb = color => convertXyz65ToRgb(convertJabToXyz65(color));

export default convertJabToRgb;
