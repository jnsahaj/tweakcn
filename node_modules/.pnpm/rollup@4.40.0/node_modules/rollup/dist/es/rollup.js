/*
  @license
	Rollup.js v4.40.0
	Sat, 12 Apr 2025 08:39:04 GMT - commit 1f2d579ccd4b39f223fed14ac7d031a6c848cd80

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
export { version as VERSION, defineConfig, rollup, watch } from './shared/node-entry.js';
import './shared/parseAst.js';
import '../native.js';
import 'node:path';
import 'path';
import 'node:process';
import 'node:perf_hooks';
import 'node:fs/promises';
