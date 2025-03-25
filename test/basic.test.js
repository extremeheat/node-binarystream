/* eslint-env mocha */
const assert = require('assert')
const ByteWriter = require('bytewriter')
const BrowserByteStream = require('../src/browser')
const NodeByteStream = require('../src/node')

describe('basic tests', () => {
  it('works', () => {
    const stream = new ByteWriter()
    stream.writeVarInt(0x04050607)
    stream.writeVarLong(0x08090a0b0c0d0e0fn)
    stream.writeZigZagVarInt(0x10111213)
    stream.writeZigZagVarLong(0x1415161718191a1bn)
    stream.writeFloatBE(1.234)
    stream.writeDoubleBE(1.23456789)
    stream.writeStringNT('hello world!')
    stream.writeBuffer(Buffer.from([0x28, 0x29, 0x2a, 0x2b, 0x2c]))
    stream.readUInt8(0x01)
    stream.readUInt16BE(0x0203)
    console.log('Buffer[24:]', stream.readRemainingWritten(), 'total:', stream.readRemaining())
    assert.strictEqual(stream.getBuffer().toString('hex'), '878c94208f9cb4e0b0c1c28408a6c8888102b6e8c881e3858b95283f9df3b63ff3c0ca4283de1b68656c6c6f20776f726c64210028292a2b2c')
    assert(ByteWriter.streamsEqual(stream, stream))
  })
})

describe('basic tests - node', () => {
  const ByteStream = NodeByteStream
  it('NT string writing', () => {
    const stream = new ByteStream()
    stream.writeStringNT('hello world!')
    assert.strictEqual(stream.readStringNT(), 'hello world!')
    assert(stream.getBuffer().equals(Buffer.from('hello world!\0')))
    assert(ByteWriter.buffersEqual(stream.getBuffer(), Buffer.from('hello world!\0')))
  })
  it('Numbers with i64', () => {
    const stream = new ByteStream()
    stream.writeInt64LE(1)
    assert.strictEqual(stream.readStringRaw(1), '\x01')
    assert(stream.getBuffer().equals(Buffer.from([1, 0, 0, 0, 0, 0, 0, 0])))
  })
  it('Negative Numbers with i64', () => {
    const stream = new ByteStream()
    stream.writeInt64LE(-1)
    assert(stream.getBuffer().equals(Buffer.from([255, 255, 255, 255, 255, 255, 255, 255])))
  })
  it('uuids', () => {
    const stream = new ByteStream()
    const randomUUID = globalThis.crypto.randomUUID()
    stream.writeUUID(randomUUID)
    const readUUID = stream.readUUID()
    assert.strictEqual(randomUUID, readUUID)
  })
  it('Varints', () => {
    const stream = new ByteStream()
    stream.writeVarInt(1)
    stream.writeVarLong(1n)
    assert(stream.getBuffer().equals(Buffer.from([1, 1])))
    stream.writeVarLong(-1n)
    stream.writeZigZagVarInt(1)
    stream.writeZigZagVarLong(1n)
    stream.writeZigZagVarInt(-1)
    stream.writeZigZagVarLong(-1n)

    assert.strictEqual(stream.readVarInt(), 1)
    assert.strictEqual(stream.readVarLong(), 1n)
    assert.strictEqual(stream.readVarLong(), -1n)
    assert.strictEqual(stream.readZigZagVarInt(), 1)
    assert.strictEqual(stream.readZigZagVarLong(), 1n)
    assert.strictEqual(stream.readZigZagVarInt(), -1)
    assert.strictEqual(stream.readZigZagVarLong(), -1n)
  })
})

Uint8Array.prototype.equals = function (array) { // eslint-disable-line
  if (this.byteLength !== array.byteLength) return false
  for (let i = 0; i < this.byteLength; i++) {
    if (this[i] !== array[i]) return false
  }
  return true
}

describe('basic tests - browser', () => {
  const ByteStream = BrowserByteStream
  it('NT string writing', () => {
    const stream = new ByteStream()
    stream.writeStringNT('hello world!')
    assert.strictEqual(stream.readStringNT(), 'hello world!')
    const expected = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33, 0])
    assert(ByteWriter.buffersEqual(stream.getBuffer(), expected))
  })
  it('Numbers with i64', () => {
    const stream = new ByteStream()
    stream.writeInt64LE(1)
    assert.strictEqual(stream.readStringRaw(1), '\x01')
    assert(stream.getBuffer().equals(Uint8Array.from([1, 0, 0, 0, 0, 0, 0, 0]))
    )
  })
  it('Negative Numbers with i64', () => {
    const stream = new ByteStream()
    stream.writeInt64LE(-1)
    assert(stream.getBuffer().equals(Uint8Array.from([255, 255, 255, 255, 255, 255, 255, 255]))
    )
  })
  it('uuids', () => {
    const stream = new ByteStream()
    const randomUUID = globalThis.crypto.randomUUID()
    stream.writeUUID(randomUUID)
    const readUUID = stream.readUUID()
    assert.strictEqual(randomUUID, readUUID)
  })
  it('Varints', () => {
    const stream = new ByteStream()
    stream.writeVarInt(1)
    stream.writeVarLong(1n)
    assert(stream.getBuffer().equals(Uint8Array.from([1, 1]))
    )
    stream.writeVarLong(-1n)
    stream.writeZigZagVarInt(1)
    stream.writeZigZagVarLong(1n)
    stream.writeZigZagVarInt(-1)
    stream.writeZigZagVarLong(-1n)

    assert.strictEqual(stream.readVarInt(), 1)
    assert.strictEqual(stream.readVarLong(), 1n)
    assert.strictEqual(stream.readVarLong(), -1n)
    assert.strictEqual(stream.readZigZagVarInt(), 1)
    assert.strictEqual(stream.readZigZagVarLong(), 1n)
    assert.strictEqual(stream.readZigZagVarInt(), -1)
    assert.strictEqual(stream.readZigZagVarLong(), -1n)
  })
})
