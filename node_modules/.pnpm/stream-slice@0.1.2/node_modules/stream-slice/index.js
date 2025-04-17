
var util = require('util');
var Transform = require('stream').Transform;

util.inherits(SliceStream, Transform);
function SliceStream(start, end) {

  if (!(this instanceof SliceStream)) {
    return new SliceStream();
  }

  Transform.call(this);
  this._start = start || 0;
  this._end = end || Infinity;
  this._offset = 0;
  this._state = 0;

  this._emitUp = false;
  this._emitDown = false;
}

SliceStream.prototype._transform = function(chunk, encoding, done) {
  this._offset += chunk.length;
  if (!this._emitUp && this._offset >= this._start) {
    this._emitUp = true;
    var start = chunk.length - (this._offset - this._start);
    if(this._offset > this._end)
    {
        var end = chunk.length - (this._offset - this._end);
        this._emitDown = true;
        this.push(chunk.slice(start, end));
    }
    else
    {
        this.push(chunk.slice(start, chunk.length));
    }
    return done();
  }
  if (this._emitUp && !this._emitDown) {
    if (this._offset >= this._end) {
      this._emitDown = true;
      this.push(chunk.slice(0, chunk.length - (this._offset - this._end)));
    } else {
      this.push(chunk);
    }
    return done();
  }
  return done();
}

exports.slice = function(start, end) {
  return new SliceStream(start, end);
}
