import { types } from '@babel/core';
import { ParseResult } from '@babel/parser';
import { NodePath } from '@babel/traverse';

/**
 * @param candidates - If provided, only these identifiers will be candidates for dead code elimination.
 */
declare function export_default$1(ast: ParseResult<types.File>, candidates?: Set<NodePath<types.Identifier>>): void;

declare function export_default(ast: ParseResult<types.File>): Set<NodePath<types.Identifier>>;

export { export_default$1 as deadCodeElimination, export_default as findReferencedIdentifiers };
