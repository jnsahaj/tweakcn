
stream-slice [![Build Status](https://travis-ci.org/yorkie/stream-slice.svg?branch=master)](https://travis-ci.org/yorkie/koa-range)
==========================
slicing stream like buffer/string

### Installation

```sh
$ npm install stream-slice --save
```

### Usage

```js
var fs = require('fs');
var slice = require('stream-slice').slice;
fs.createReadStream('your path')
  .pipe(slice(10, 100))
  .on('data', function() {
    // here we only get the buffer from 10th to 100th.
  });
```

slicing file
```js
var fs = require('fs');
var slice = require('stream-slice').slice;
fs.createReadStream('sourc file path')
  .pipe(slice(0, 200))
  .pipe(fs.createWriteStream('dest file path'));
```

### License

MIT