import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import * as ts from 'typescript';
export * from '@typescript-eslint/utils/ast-utils';
/**
 * Get the `loc` object of a given name in a `/*globals` directive comment.
 * @param sourceCode The source code to convert index to loc.
 * @param comment The `/*globals` directive comment which include the name.
 * @param name The name to find.
 * @returns The `loc` object.
 */
export declare function getNameLocationInGlobalDirectiveComment(sourceCode: TSESLint.SourceCode, comment: TSESTree.Comment, name: string): TSESTree.SourceLocation;
export declare function forEachReturnStatement<T>(body: ts.Block, visitor: (stmt: ts.ReturnStatement) => T): T | undefined;
//# sourceMappingURL=astUtils.d.ts.map