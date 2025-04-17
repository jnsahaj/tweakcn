import glob from 'fast-glob';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const IMPORT_STATEMENT_REGEXP =
  /import([ \n\t]*(?:[^ \n\t\{\}]+[ \n\t]*,?)?(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)from[ \n\t]*(['"])([^'"\n]+)(?:['"])/g;

const EXPORT_STATEMENT_REGEXP =
  /export([ \n\t]*(?:[^ \n\t\{\}]+[ \n\t]*,?)?(?:[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)from[ \n\t]*(['"])([^'"\n]+)(?:['"])/g;

const files = glob.sync(
  join(import.meta.dirname, '..', 'dist', '*', 'types', '*.d.ts'),
);

function getReplacement(type) {
  return function (line, dependencies, _quoteType, location) {
    const extension = line.startsWith(`${type} type`) ? 'd.ts' : 'ts';

    return `${type}${dependencies}from '${location}.${extension}'`;
  };
}

function getReplacedContents(contents) {
  return contents
    .replaceAll(IMPORT_STATEMENT_REGEXP, getReplacement('import'))
    .replaceAll(EXPORT_STATEMENT_REGEXP, getReplacement('export'));
}

for (const file of files) {
  const contents = readFileSync(file, 'utf-8');

  writeFileSync(file, getReplacedContents(contents), 'utf-8');
}
