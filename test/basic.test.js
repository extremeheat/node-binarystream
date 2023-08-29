/* eslint-env mocha */
const assert = require('assert')
const ByteStream = require('bytewriter')

describe('basic tests', () => {
  it('NT string writing', () => {
    const stream = new ByteStream()
    stream.writeStringNT('hello world!')
    assert(stream.getBuffer().equals(Buffer.from('hello world!\0')))
  })
  it('Numbers with i64', () => {
    const stream = new ByteStream()
    stream.writeInt64LE(1)
    assert(stream.getBuffer().equals(Buffer.from([1, 0, 0, 0, 0, 0, 0, 0])))
  })
  it('Negative Numbers with i64', () => {
    const stream = new ByteStream()
    stream.writeInt64LE(-1)
    assert(stream.getBuffer().equals(Buffer.from([255, 255, 255, 255, 255, 255, 255, 255])))
  })
})
