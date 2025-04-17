
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./sortable.cjs.production.min.js')
} else {
  module.exports = require('./sortable.cjs.development.js')
}
