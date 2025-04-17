
var test = require('tape');
var fs = require('fs');
var slice = require('./index').slice;
var bufferReady = fs.readFileSync('./README.md');

test('normal test', function(t) {
  var chunks = [];
  fs.createReadStream('./README.md')
    .pipe(slice(0, 10))
    .on('data', chunks.push.bind(chunks))
    .on('end', function() {
      var res = Buffer.concat(chunks);
      t.equal(res.length, 10);
      t.equal(bufferEq(res, bufferReady.slice(0, 10)), true);
      t.end();
    });
});

test('normal test', function(t) {
  var chunks = [];
  fs.createReadStream('./README.md')
    .pipe(slice(10, 20))
    .on('data', chunks.push.bind(chunks))
    .on('end', function() {
      var res = Buffer.concat(chunks);
      t.equal(res.length, 10);
      t.equal(bufferEq(res, bufferReady.slice(10, 20)), true);
      t.end();
    });
});

function bufferEq(foo, bar) {
  if (!Buffer.isBuffer(foo) || !Buffer.isBuffer(bar)) {
    throw new TypeError('Arguments must be a buffer');
  }
  if (foo.length !== bar.length) {
    return false;
  }
  for (var i = 0; i < foo.length; i++) {
    if (foo[i] !== bar[i]) {
      return false;
    }
  }
  return true;
}