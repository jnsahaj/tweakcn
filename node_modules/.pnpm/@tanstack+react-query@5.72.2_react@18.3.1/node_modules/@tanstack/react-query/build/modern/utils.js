// src/utils.ts
function shouldThrowError(throwError, params) {
  if (typeof throwError === "function") {
    return throwError(...params);
  }
  return !!throwError;
}
function noop() {
}
export {
  noop,
  shouldThrowError
};
//# sourceMappingURL=utils.js.map