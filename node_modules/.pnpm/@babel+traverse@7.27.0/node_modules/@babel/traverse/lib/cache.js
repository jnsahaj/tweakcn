"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;
exports.clearPath = clearPath;
exports.clearScope = clearScope;
exports.getCachedPaths = getCachedPaths;
exports.getOrCreateCachedPaths = getOrCreateCachedPaths;
exports.scope = exports.path = void 0;
let pathsCache = exports.path = new WeakMap();
let scope = exports.scope = new WeakMap();
function clear() {
  clearPath();
  clearScope();
}
function clearPath() {
  exports.path = pathsCache = new WeakMap();
}
function clearScope() {
  exports.scope = scope = new WeakMap();
}
const nullHub = Object.freeze({});
function getCachedPaths(hub, parent) {
  var _pathsCache$get;
  {
    hub = null;
  }
  return (_pathsCache$get = pathsCache.get(hub != null ? hub : nullHub)) == null ? void 0 : _pathsCache$get.get(parent);
}
function getOrCreateCachedPaths(hub, parent) {
  {
    hub = null;
  }
  let parents = pathsCache.get(hub != null ? hub : nullHub);
  if (!parents) pathsCache.set(hub != null ? hub : nullHub, parents = new WeakMap());
  let paths = parents.get(parent);
  if (!paths) parents.set(parent, paths = new Map());
  return paths;
}

//# sourceMappingURL=cache.js.map
