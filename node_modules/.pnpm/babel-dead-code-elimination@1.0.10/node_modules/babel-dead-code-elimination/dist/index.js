// src/babel-esm.ts
import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
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
export {
  dead_code_elimination_default as deadCodeElimination,
  find_referenced_identifiers_default as findReferencedIdentifiers
};
