# babel-dead-code-elimination

Composable primitives for dead code elimination in Babel

This package is **not a Babel plugin**, but rather a set of composable primitives to author your own Babel transforms and plugins.

## Install

```sh
npm install babel-dead-code-elimination
```

## deadCodeElimination

Eliminates unused code from the Babel AST by repeatedly removing unreferenced identifiers.

```ts
import { parse } from "@babel/parser"
import generate from "@babel/generator"

import { deadCodeElimination } from "babel-dead-code-elimination"

let source = "..."
let ast = parse(source, { sourceType: "module" })
deadCodeElimination(ast)
let result = generate(ast).code
```

## findReferencedIdentifiers

Find identifiers that are currently referenced in the Babel AST.

Useful for limiting `deadCodeElimination` to only eliminate _newly_ unreferenced identifiers,
as a best effort to preserve any intentional side-effects in the source.

```ts
import { parse } from "@babel/parser"
import generate from "@babel/generator"
import traverse from "@babel/traverse"

import {
  deadCodeElimination,
  findReferencedIdentifiers,
} from "babel-dead-code-elimination"

let source = "..."
let ast = parse(source, { sourceType: "module" })
let referenced = findReferencedIdentifiers(ast)

traverse(ast, {
  /* ... your custom transform goes here ... */
})

deadCodeElimination(ast, referenced)
let result = generate(ast).code
```

## Prior art

Credit to [Jason Miller](https://github.com/developit) for the initial implementation.
Thanks to these projects for exploring dead code elimination:

- [Next.js](https://github.com/vercel/next.js/pull/9652)
- [babel-plugin-eliminator](https://github.com/egoist/babel-plugin-eliminator/blob/d47034ed765352c02d588afdaa40510967332b21/src/index.ts)
- [bling](https://github.com/TanStack/bling/blob/c8ee1d1ae3009ecefc747edaad45a7dfba9ecc9f/packages/bling/src/compilers.ts)
