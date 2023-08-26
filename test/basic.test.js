/* eslint-env mocha */
const assert = require('assert')
const ByteStream = require('binarystream')

describe('basic tests', () => {
  it('NT string writing', () => {
    const stream = new ByteStream()
    stream.writeStringNT('hello world!')
    assert(stream.getBuffer().equals(Buffer.from('hello world!\0')))
  })
})
