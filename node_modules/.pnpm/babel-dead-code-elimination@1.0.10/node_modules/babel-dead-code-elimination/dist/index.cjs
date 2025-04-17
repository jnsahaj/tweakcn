"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  deadCodeElimination: () => dead_code_elimination_default,
  findReferencedIdentifiers: () => find_referenced_identifiers_default
});
module.exports = __toCommonJS(src_exports);

// node_modules/.pnpm/tsup@8.0.2_postcss@8.4.38_typescript@5.4.5/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/babel-esm.ts
var import_parser = require("@babel/parser");
var t = __toESM(require("@babel/types"), 1);
var import_node_module = require("module");
var require2 = (0, import_node_module.createRequire)(importMetaUrl);
var _traverse = require2("@babel/traverse");
var traverse = _traverse.default;

// src/identifier.ts
function isReferenced(ident) {
  let binding = ident.scope.getBinding(ident.node.name);
  if (!binding)
    return false;
  if (binding.referenced) {
    if (binding.path.type === "FunctionDeclaration") {
      return !binding.constantViolations.concat(binding.referencePaths).every((ref) => ref.findParent((parent) => parent === binding?.path));
    }
    return true;
  }
  if (binding.path.isVariableDeclarator() && (binding.path.parentPath?.parentPath?.isForOfStatement() || binding.path.parentPath?.parentPath?.isForInStatement())) {
    return true;
  }
  return binding.constantViolations.length > 0;
}

// src/errors.ts
function unexpected(path) {
  let type = path.node === null ? "null" : path.node.type;
  return path.buildCodeFrameError(
    `[babel-dead-code-elimination] unexpected node type: ${type}`
  );
}

// src/pattern.ts
function findVariables(patternPath) {
  let variables = [];
  function recurse(path) {
    if (path.isIdentifier()) {
      variables.push(path);
      return;
    }
    if (path.isObjectPattern()) {
      return path.get("properties").forEach(recurse);
    }
    if (path.isObjectProperty()) {
      return recurse(path.get("value"));
    }
    if (path.isArrayPattern()) {
      let _elements = path.get("elements");
      return _elements.forEach(recurse);
    }
    if (path.isAssignmentPattern()) {
      return recurse(path.get("left"));
    }
    if (path.isRestElement()) {
      return recurse(path.get("argument"));
    }
    if (path.node === null)
      return;
    throw unexpected(path);
  }
  recurse(patternPath);
  return variables;
}
function remove(path) {
  let parent = path.parentPath;
  if (parent.isVariableDeclarator()) {
    return parent.remove();
  }
  if (parent.isArrayPattern()) {
    parent.node.elements[path.key] = null;
    return;
  }
  if (parent.isObjectProperty()) {
    return parent.remove();
  }
  if (parent.isRestElement()) {
    return parent.remove();
  }
  if (parent.isAssignmentPattern()) {
    if (t.isObjectProperty(parent.parent)) {
      return parent.parentPath.remove();
    }
    if (t.isArrayPattern(parent.parent)) {
      parent.parent.elements[parent.key] = null;
      return;
    }
    throw unexpected(parent.parentPath);
  }
  throw unexpected(parent);
}

// src/dead-code-elimination.ts
function dead_code_elimination_default(ast, candidates) {
  let removals;
  let shouldBeRemoved = (ident) => {
    if (candidates && !candidates.has(ident))
      return false;
    if (isReferenced(ident))
      return false;
    if (ident.parentPath.parentPath?.isObjectPattern()) {
      if (ident.parentPath.isRestElement())
        return true;
      return !ident.parentPath.parentPath.get("properties").at(-1)?.isRestElement();
    }
    if (!candidates)
      return true;
    return candidates.has(ident);
  };
  do {
    removals = 0;
    traverse(ast, {
      Program(path) {
        path.scope.crawl();
      },
      ImportDeclaration(path) {
        let removalsBefore = removals;
        for (let specifier of path.get("specifiers")) {
          let local = specifier.get("local");
          if (shouldBeRemoved(local)) {
            specifier.remove();
            removals++;
          }
        }
        if (removals > removalsBefore && path.node.specifiers.length === 0) {
          path.remove();
        }
      },
      VariableDeclarator(path) {
        let id = path.get("id");
        if (id.isIdentifier()) {
          if (shouldBeRemoved(id)) {
            path.remove();
            removals++;
          }
        } else if (id.isObjectPattern() || id.isArrayPattern()) {
          for (let variable of findVariables(id)) {
            if (!shouldBeRemoved(variable))
              continue;
            let parent = variable.parentPath;
            if (parent.isObjectProperty()) {
              parent.remove();
              removals++;
              continue;
            }
            if (parent.isArrayPattern()) {
              parent.node.elements[variable.key] = null;
              removals++;
              continue;
            }
            if (parent.isAssignmentPattern()) {
              if (t.isObjectProperty(parent.parent)) {
                parent.parentPath?.remove();
                removals++;
                continue;
              }
              if (t.isArrayPattern(parent.parent)) {
                parent.parent.elements[parent.key] = null;
                removals++;
                continue;
              }
              throw unexpected(parent);
            }
            if (parent.isRestElement()) {
              parent.remove();
              removals++;
              continue;
            }
            throw unexpected(parent);
          }
        }
      },
      ObjectPattern(path) {
        let isWithinDeclarator = path.find((p) => p.isVariableDeclarator()) !== null;
        let isFunctionParam = path.parentPath.isFunction() && path.parentPath.node.params.includes(path.node);
        let isEmpty = path.node.properties.length === 0;
        if (isWithinDeclarator && !isFunctionParam && isEmpty) {
          remove(path);
          removals++;
        }
      },
      ArrayPattern(path) {
        let isWithinDeclarator = path.find((p) => p.isVariableDeclarator()) !== null;
        let isFunctionParam = path.parentPath.isFunction() && path.parentPath.node.params.includes(path.node);
        let isEmpty = path.node.elements.every((e) => e === null);
        if (isWithinDeclarator && !isFunctionParam && isEmpty) {
          remove(path);
          removals++;
        }
      },
      FunctionDeclaration(path) {
        let id = path.get("id");
        if (id.isIdentifier() && shouldBeRemoved(id)) {
          removals++;
          if (t.isAssignmentExpression(path.parentPath.node) || t.isVariableDeclarator(path.parentPath.node)) {
            path.parentPath.remove();
          } else {
            path.remove();
          }
        }
      }
    });
  } while (removals > 0);
}

// src/find-referenced-identifiers.ts
function find_referenced_identifiers_default(ast) {
  const referenced = /* @__PURE__ */ new Set();
  traverse(ast, {
    ImportDeclaration(path) {
      for (let specifier of path.get("specifiers")) {
        let local = specifier.get("local");
        if (isReferenced(local)) {
          referenced.add(local);
        }
      }
    },
    VariableDeclarator(path) {
      let id = path.get("id");
      if (id.isIdentifier()) {
        if (isReferenced(id)) {
          referenced.add(id);
        }
      } else if (id.isObjectPattern() || id.isArrayPattern()) {
        for (let variable of findVariables(id)) {
          if (isReferenced(variable)) {
            referenced.add(variable);
          }
        }
      }
    },
    FunctionDeclaration(path) {
      let id = path.get("id");
      if (id.isIdentifier() && isReferenced(id)) {
        referenced.add(id);
      }
    }
  });
  return referenced;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deadCodeElimination,
  findReferencedIdentifiers
});
