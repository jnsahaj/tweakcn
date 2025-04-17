import convertLabToXyz50 from './convertLabToXyz50.js';
import convertXyz50ToRgb from '../xyz50/convertXyz50ToRgb.js';

const convertLabToRgb = lab => convertXyz50ToRgb(convertLabToXyz50(lab));

export default convertLabToRgb;
