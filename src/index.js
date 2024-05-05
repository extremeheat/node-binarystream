const NodeBinaryStream = require('./node')
const BrowserBinaryStream = require('./browser')

module.exports = typeof Buffer === 'undefined'
  ? BrowserBinaryStream
  : NodeBinaryStream
