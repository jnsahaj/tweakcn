/*
 * Global helpers to protect access to browser globals in a way that is safer for different targets
 * like DOM, SSR, Web workers etc.
 *
 * NOTE: Typically we want the "window" but globalThis works for both the typical browser context as
 * well as other contexts such as the web worker context. Window is still exported for any bits that explicitly require it.
 * If in doubt - export the global you need from this file and use that as an optional value. This way the code path is forced
 * to handle the case where the global is not available.
 */
// eslint-disable-next-line no-restricted-globals
var win = typeof window !== 'undefined' ? window : undefined;
var global = typeof globalThis !== 'undefined' ? globalThis : win;
export var ArrayProto = Array.prototype;
export var nativeForEach = ArrayProto.forEach;
export var nativeIndexOf = ArrayProto.indexOf;
export var navigator = global === null || global === void 0 ? void 0 : global.navigator;
export var document = global === null || global === void 0 ? void 0 : global.document;
export var location = global === null || global === void 0 ? void 0 : global.location;
export var fetch = global === null || global === void 0 ? void 0 : global.fetch;
export var XMLHttpRequest = (global === null || global === void 0 ? void 0 : global.XMLHttpRequest) && 'withCredentials' in new global.XMLHttpRequest() ? global.XMLHttpRequest : undefined;
export var AbortController = global === null || global === void 0 ? void 0 : global.AbortController;
export var userAgent = navigator === null || navigator === void 0 ? void 0 : navigator.userAgent;
export var assignableWindow = win !== null && win !== void 0 ? win : {};
export { win as window };
//# sourceMappingURL=globals.js.map