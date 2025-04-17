export declare const mathSign: (value: number) => 0 | 1 | -1;
export declare const isPercent: (value: string | number) => value is `${number}%`;
export declare const isNumber: (value: unknown) => value is number;
export declare const isNumOrStr: (value: unknown) => value is string | number;
export declare const uniqueId: (prefix?: string) => string;
/**
 * Get percent value of a total value
 * @param {number|string} percent A percent
 * @param {number} totalValue     Total value
 * @param {number} defaultValue   The value returned when percent is undefined or invalid
 * @param {boolean} validate      If set to be true, the result will be validated
 * @return {number} value
 */
export declare const getPercentValue: (percent: number | string, totalValue: number, defaultValue?: number, validate?: boolean) => number;
export declare const getAnyElementOfObject: (obj: any) => any;
export declare const hasDuplicate: (ary: Array<any>) => boolean;
export declare const interpolateNumber: (numberA: number, numberB: number) => (t: number) => number;
export declare function findEntryInArray<T>(ary: Array<T>, specifiedKey: number | string | ((entry: T) => unknown), specifiedValue: unknown): T;
/**
 * The least square linear regression
 * @param {Array} data The array of points
 * @returns {Object} The domain of x, and the parameter of linear function
 */
export declare const getLinearRegression: (data: Array<{
    cx?: number;
    cy?: number;
}>) => {
    xmin: number;
    xmax: number;
    a: number;
    b: number;
};
