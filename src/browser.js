const MAX_ALLOC_SIZE = 1024 * 1024 * 2 // 2MB
const DEFAULT_ALLOC_SIZE = 10000 // 10 KB

class ByteStream {
  constructor (buffer, maxSize) {
    if (buffer instanceof ArrayBuffer) {
      this.buffer = new Uint8Array(buffer)
    } else if (buffer instanceof Uint8Array) {
      this.buffer = buffer
    } else {
      this.buffer = new Uint8Array(DEFAULT_ALLOC_SIZE)
    }
    this.readOffset = 0
    this.writeOffset = 0
    this.size = this.buffer.length
    this.guardLimit = maxSize || MAX_ALLOC_SIZE
    this.view = new DataView(this.buffer.buffer)
  }

  resizeForWriteIfNeeded (bytes) {
    if ((this.writeOffset + bytes) > this.size) {
      const allocSize = this.writeOffset
      const newBuffer = new Uint8Array(allocSize)
      newBuffer.set(this.buffer)
      this.buffer = newBuffer
      this.size = this.buffer.length
      this.view = new DataView(this.buffer.buffer)
    }
    if (this.size > this.guardLimit) throw new Error('Buffer size exceeded guard limit')
  }

  readByte () {
    return this.buffer[this.readOffset++]
  }

  // Write unsigned
  writeUInt8 (value) {
    this.resizeForWriteIfNeeded(1)
    this.buffer[this.writeOffset] = value
    this.writeOffset += 1
  }

  writeUInt16LE (value) {
    this.resizeForWriteIfNeeded(2)
    this.view.setUint16(this.writeOffset, value, true)
    this.writeOffset += 2
  }

  writeUInt32LE (value) {
    this.resizeForWriteIfNeeded(4)
    this.view.setUint32(this.writeOffset, value, true)
    this.writeOffset += 4
  }

  writeUInt64LE (value) {
    this.resizeForWriteIfNeeded(8)
    this.view.setBigUint64(this.writeOffset, BigInt(value), true)
    this.writeOffset += 8
  }

  writeFloatLE (value) {
    this.resizeForWriteIfNeeded(4)
    this.view.setFloat32(this.writeOffset, value, true)
    this.writeOffset += 4
  }

  writeDoubleLE (value) {
    this.resizeForWriteIfNeeded(8)
    this.view.setFloat64(this.writeOffset, value, true)
    this.writeOffset += 8
  }

  writeUInt16BE (value) {
    this.resizeForWriteIfNeeded(2)
    this.view.setUint16(this.writeOffset, value, false)
    this.writeOffset += 2
  }

  writeUInt32BE (value) {
    this.resizeForWriteIfNeeded(4)
    this.view.setUint32(this.writeOffset, value, false)
    this.writeOffset += 4
  }

  writeUInt64BE (value) {
    this.resizeForWriteIfNeeded(8)
    this.view.setBigUint64(this.writeOffset, BigInt(value), false)
    this.writeOffset += 8
  }

  // Write signed
  writeInt8 (value) {
    this.resizeForWriteIfNeeded(1)
    this.buffer[this.writeOffset] = value
    this.writeOffset += 1
  }

  writeInt16LE (value) {
    this.resizeForWriteIfNeeded(2)
    this.view.setInt16(this.writeOffset, value, true)
    this.writeOffset += 2
  }

  writeInt32LE (value) {
    this.resizeForWriteIfNeeded(4)
    this.view.setInt32(this.writeOffset, value, true)
    this.writeOffset += 4
  }

  writeInt64LE (value) {
    this.resizeForWriteIfNeeded(8)
    this.view.setBigInt64(this.writeOffset, BigInt(value), true)
    this.writeOffset += 8
  }

  writeInt16BE (value) {
    this.resizeForWriteIfNeeded(2)
    this.view.setInt16(this.writeOffset, value, false)
    this.writeOffset += 2
  }

  writeInt32BE (value) {
    this.resizeForWriteIfNeeded(4)
    this.view.setInt32(this.writeOffset, value, false)
    this.writeOffset += 4
  }

  writeInt64BE (value) {
    this.resizeForWriteIfNeeded(8)
    this.view.setBigInt64(this.writeOffset, BigInt(value), false)
    this.writeOffset += 8
  }

  // Write floats
  writeFloatBE (value) {
    this.resizeForWriteIfNeeded(4)
    this.view.setFloat32(this.writeOffset, value, false)
    this.writeOffset += 4
  }

  writeDoubleBE (value) {
    this.resizeForWriteIfNeeded(8)
    this.view.setFloat64(this.writeOffset, value, false)
    this.writeOffset += 8
  }

  // Read
  readUInt8 () {
    const value = this.buffer[this.readOffset]
    this.readOffset += 1
    return value
  }

  readUInt16LE () {
    const value = this.view.getUint16(this.readOffset, true)
    this.readOffset += 2
    return value
  }

  readUInt32LE () {
    const value = this.view.getUint32(this.readOffset, true)
    this.readOffset += 4
    return value
  }

  readUInt64LE () {
    const value = this.view.getBigUint64(this.readOffset, true)
    this.readOffset += 8
    return value
  }

  readUInt16BE () {
    const value = this.view.getUint16(this.readOffset, false)
    this.readOffset += 2
    return value
  }

  readUInt32BE () {
    const value = this.view.getUint32(this.readOffset, false)
    this.readOffset += 4
    return value
  }

  readUInt64BE () {
    const value = this.view.getBigUint64(this.readOffset, false)
    this.readOffset += 8
    return value
  }

  readInt8 () {
    const value = this.buffer[this.readOffset]
    this.readOffset += 1
    return value
  }

  readInt16LE () {
    const value = this.view.getInt16(this.readOffset, true)
    this.readOffset += 2
    return value
  }

  readInt32LE () {
    const value = this.view.getInt32(this.readOffset, true)
    this.readOffset += 4
    return value
  }

  readInt64LE () {
    const value = this.view.getBigInt64(this.readOffset, true)
    this.readOffset += 8
    return value
  }

  // Strings
  writeStringNT (value, encoding = 'utf8') {
    const encoder = new TextEncoder(encoding)
    const encodedString = encoder.encode(value)
    this.resizeForWriteIfNeeded(encodedString.length + 1)
    this.buffer.set(encodedString, this.writeOffset)
    this.buffer[this.writeOffset + encodedString.length] = 0 // Null terminator
    this.writeOffset += encodedString.length + 1
  }

  readStringNT (encoding = 'utf8') {
    let length = 0
    while (this.buffer[this.readOffset + length] !== 0) {
      length += 1
    }
    const value = this.buffer.subarray(this.readOffset, this.readOffset + length)
    this.readOffset += length + 1
    return new TextDecoder(encoding).decode(value)
  }

  writeStringRaw (value, encoding = 'utf8') {
    const encoder = new TextEncoder(encoding)
    const encodedString = encoder.encode(value)
    this.resizeForWriteIfNeeded(encodedString.length)
    this.buffer.set(encodedString, this.writeOffset)
    this.writeOffset += encodedString.length
  }

  readStringRaw (length, encoding = 'utf8') {
    const value = this.buffer.subarray(this.readOffset, this.readOffset + length)
    this.readOffset += length
    return new TextDecoder(encoding).decode(value)
  }

  writeBuffer (value) {
    this.resizeForWriteIfNeeded(value.byteLength)
    this.buffer.set(value, this.writeOffset)
    this.writeOffset += value.byteLength
  }

  readBuffer (length) {
    const value = this.buffer.subarray(this.readOffset, this.readOffset + length)
    this.readOffset += length
    return value
  }

  readRemaining () {
    const value = this.buffer.subarray(this.readOffset)
    this.readOffset = this.buffer.length
    return value
  }

  readRemainingWritten () {
    const value = this.buffer.subarray(0, this.writeOffset)
    this.readOffset = this.writeOffset
    return value
  }

  // Write a UUID as big endian (accepts string with/without dashes or Uint8Array)
  writeUUID (uuid) {
    this.resizeForWriteIfNeeded(16) // UUID is always 16 bytes

    let bytes
    if (uuid instanceof Uint8Array) {
      if (uuid.length !== 16) throw new Error('UUID Uint8Array must be 16 bytes')
      bytes = uuid
    } else if (typeof uuid === 'string') {
      const hex = uuid.replace(/-/g, '')
      if (hex.length !== 32) {
        throw new Error('Invalid UUID string format')
      }
      bytes = new Uint8Array(16)
      for (let i = 0; i < 16; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
      }
    } else {
      throw new Error('UUID must be a string or Uint8Array')
    }
    this.buffer.set(bytes, this.writeOffset)
    this.writeOffset += 16
  }

  // Read a UUID and return it as a string with dashes
  readUUID () {
    if (this.readOffset + 16 > this.buffer.length) {
      throw new Error('Not enough bytes to read UUID')
    }
    const uuidBytes = this.buffer.subarray(this.readOffset, this.readOffset + 16)
    this.readOffset += 16
    const hex = Array.from(uuidBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  // Varints
  // Write a signed varint
  writeVarInt (value) {
    this.resizeForWriteIfNeeded(9)
    let offset = 0
    while (value & ~0x7F) {
      this.buffer[this.writeOffset + offset] = (value & 0x7f) | 0x80
      value = value >>> 7
      offset += 1
    }
    this.buffer[this.writeOffset + offset] = value
    this.writeOffset += offset + 1
  }

  // Read a signed varint
  readVarInt () {
    let value = 0
    let offset = 0
    let byte
    do {
      byte = this.buffer[this.readOffset + offset]
      value |= (byte & 0x7f) << (7 * offset)
      offset += 1
    } while (byte & 0x80)
    this.readOffset += offset
    return value
  }

  // Write a signed 64-bit varint
  writeVarLong (value) {
    value = typeof value === 'bigint' ? value : BigInt(value)
    this.resizeForWriteIfNeeded(9)
    value = BigInt.asUintN(64, value)
    let offset = 0
    while (value & ~0x7Fn) {
      this.buffer[this.writeOffset + offset] = Number((value & 0x7fn) | 0x80n)
      value = value >> 7n
      offset += 1
    }
    this.buffer[this.writeOffset + offset] = Number(value)
    this.writeOffset += offset + 1
  }

  // Read a signed 64-bit varint
  readVarLong () {
    let value = 0n
    let offset = 0
    let byte
    do {
      byte = this.buffer[this.readOffset + offset]
      value |= BigInt(byte & 0x7f) << BigInt(7 * offset)
      offset += 1
    } while (byte & 0x80)
    this.readOffset += offset
    return BigInt.asIntN(64, value)
  }

  // Write a zigzag encoded, signed varint upto 32bits
  writeZigZagVarInt (value) {
    const zigzag = (value << 1) ^ (value >> 31)
    this.writeVarInt(zigzag)
  }

  // Read a zigzag encoded, signed varint upto 32bits
  readZigZagVarInt () {
    const value = this.readVarInt()
    return (value >>> 1) ^ -(value & 1)
  }

  // Write a zigzag encoded, signed varint upto 64bits
  writeZigZagVarLong (value) {
    value = typeof value === 'bigint' ? value : BigInt(value)
    const zigzag = (value << 1n) ^ (value >> 63n)
    this.writeVarLong(zigzag)
  }

  // Read a zigzag encoded, signed varint upto 64bits
  readZigZagVarLong () {
    const value = this.readVarLong()
    return (value >> 1n) ^ -(value & 1n)
  }

  // Extra
  peekUInt8 () {
    return this.buffer[this.readOffset]
  }

  peek () {
    return this.buffer[this.readOffset]
  }

  getBuffer () {
    return this.buffer.subarray(0, this.writeOffset)
  }

  static buffersEqual (a, b) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  static streamsEqual (a, b) {
    return ByteStream.buffersEqual(a.getBuffer(), b.getBuffer())
  }
}

module.exports = ByteStream
