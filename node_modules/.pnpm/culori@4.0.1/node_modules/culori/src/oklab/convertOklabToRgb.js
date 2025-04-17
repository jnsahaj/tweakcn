import convertLrgbToRgb from '../lrgb/convertLrgbToRgb.js';
import convertOklabToLrgb from './convertOklabToLrgb.js';

const convertOklabToRgb = c => convertLrgbToRgb(convertOklabToLrgb(c));

export default convertOklabToRgb;
