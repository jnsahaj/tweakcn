# tiny-isequal

[![source](https://badgen.net/npm/v/@ngard/tiny-isequal)](https://www.npmjs.com/package/@ngard/tiny-isequal)
[![bundle size](https://badgen.net/bundlephobia/minzip/@ngard/tiny-isequal)](https://bundlephobia.com/result?p=@ngard/tiny-isequal)
[![build status](https://badgen.net/travis/NickGard/tiny-isequal)](https://travis-ci.org/NickGard/tiny-isequal)
[![license](https://badgen.net/badge/license/MIT/blue)](https://badgen.net/badge/license/MIT/blue)

A minimal-weight utility similar to `lodash.isequal`. For when every byte counts!
Performs a deep (recursive) comparison between the two arguments. It differs from
`lodash.isequal` in one significant way: it requires that the two values have the
same prototype and properies, including unenumerable ones.

<hr/>

lodash.isequal: [![bundle size](https://badgen.net/bundlephobia/minzip/lodash.isequal)](https://bundlephobia.com/result?p=lodash.isequal)
<br/>
tiny-isequal: [![bundle size](https://badgen.net/bundlephobia/minzip/@ngard/tiny-isequal)](https://bundlephobia.com/result?p=@ngard/tiny-isequal)

<hr/>

## Install

```bash
npm install @ngard/tiny-isequal
```

## Syntax

```javascript
isEqual(/* value1, value2 */);
```

## Parameters

`value1` - Any Javascript value
`value2` - Any Javascript value

## Return

`true` if the two values are deeply equal, `false` otherwise.

<hr/>

## Examples

```javascript
import { isEqual } from "@ngard/tiny-isequal";

const samesies = isEqual({ a: 1 }, { a: 1 });
// samesies is true
```

```javascript
import { isEqual } from "@ngard/tiny-isequal";

const samesies = isEqual({ a: { b: "c" } }, { a: { b: "c" } });
// samesies is true
```

```javascript
import { isEqual } from "@ngard/tiny-isequal";

const obj = [1, 2, 3];
const samesies = isEqual(obj, obj);
// samesies is true
```

```javascript
import { isEqual } from "@ngard/tiny-isequal";

const samesies = isEqual(NaN, NaN);
// samesies is true
```
