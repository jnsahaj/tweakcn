
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./modifiers.cjs.production.min.js')
} else {
  module.exports = require('./modifiers.cjs.development.js')
}
