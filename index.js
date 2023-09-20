const MAX_ALLOC_SIZE = 1024 * 1024 * 2 // 2MB
const DEFAULT_ALLOC_SIZE = 10000

class ByteStream {
  constructor (buffer, maxSize) {
    this.buffer = buffer || Buffer.allocUnsafe(DEFAULT_ALLOC_SIZE)
    this.readOffset = 0
    this.writeOffset = 0
    this.size = this.buffer.length
    // Instead of increasing the guard limit, consider pre-allocating a big Buffer if you know you will be working with big data
    this.guardLimit = maxSize || MAX_ALLOC_SIZE
  }

  resizeForWriteIfNeeded (bytes) {
    if ((this.writeOffset + bytes) > this.size) {
      this.size *= 2
      const allocSize = this.size - this.writeOffset
      this.buffer = Buffer.concat([this.buffer, Buffer.allocUnsafe(allocSize)])
    }
    // Detect potential writing bugs
    if (this.size > this.guardLimit) throw new Error('Buffer size exceeded guard limit')
  }

  readByte () {
    return this.buffer[this.readOffset++]
  }

  // Write unsigned

  writeUInt8 (value) {
    this.resizeForWriteIfNeeded(1)
    this.buffer.writeUInt8(value, this.writeOffset)
    this.writeOffset += 1
  }

  writeUInt16LE (value) {
    this.resizeForWriteIfNeeded(2)
    this.buffer.writeUInt16LE(value, this.writeOffset)
    this.writeOffset += 2
  }

  writeUInt32LE (value) {
    this.resizeForWriteIfNeeded(4)
    this.buffer.writeUInt32LE(value, this.writeOffset)
    this.writeOffset += 4
  }

  writeUInt64LE (value) {
    this.resizeForWriteIfNeeded(8)
    switch (typeof value) {
      case 'bigint':
        this.buffer.writeBigUInt64LE(value, this.writeOffset)
        break
      case 'number':
        this.buffer.writeUInt32LE(value & 0xffffffff, this.writeOffset)
        this.buffer.writeUInt32LE(Math.floor(value / 4294967296), this.writeOffset + 4)
        break
      default:
        throw new Error('Invalid value type')
    }

    this.writeOffset += 8
  }

  writeFloatLE (value) {
    this.resizeForWriteIfNeeded(4)
    this.buffer.writeFloatLE(value, this.writeOffset)
    this.writeOffset += 4
  }

  writeDoubleLE (value) {
    this.resizeForWriteIfNeeded(8)
    this.buffer.writeDoubleLE(value, this.writeOffset)
    this.writeOffset += 8
  }

  writeUInt16BE (value) {
    this.resizeForWriteIfNeeded(2)
    this.buffer.writeUInt16BE(value, this.writeOffset)
    this.writeOffset += 2
  }

  writeUInt32BE (value) {
    this.resizeForWriteIfNeeded(4)
    this.buffer.writeUInt32BE(value, this.writeOffset)
    this.writeOffset += 4
  }

  writeUInt64BE (value) {
    this.resizeForWriteIfNeeded(8)
    switch (typeof value) {
      case 'bigint':
        this.buffer.writeBigUInt64BE(value, this.writeOffset)
        break
      case 'number':
        this.buffer.writeUInt32BE(Math.floor(value / 4294967296), this.writeOffset)
        this.buffer.writeUInt32BE(value & 0xffffffff, this.writeOffset + 4)
        break
      default:
        throw new Error('Invalid value type')
    }

    this.writeOffset += 8
  }

  // Write signed

  writeInt8 (value) {
    this.resizeForWriteIfNeeded(1)
    this.buffer.writeInt8(value, this.writeOffset)
    this.writeOffset += 1
  }

  writeInt16LE (value) {
    this.resizeForWriteIfNeeded(2)
    this.buffer.writeInt16LE(value, this.writeOffset)
    this.writeOffset += 2
  }

  writeInt32LE (value) {
    this.resizeForWriteIfNeeded(4)
    this.buffer.writeInt32LE(value, this.writeOffset)
    this.writeOffset += 4
  }

  writeInt64LE (value) {
    this.resizeForWriteIfNeeded(8)
    switch (typeof value) {
      case 'bigint':
        this.buffer.writeBigInt64LE(value, this.writeOffset)
        break
      case 'number':
        this.buffer.writeInt32LE(value & 0xffffffff, this.writeOffset)
        this.buffer.writeInt32LE(Math.floor(value / 4294967296), this.writeOffset + 4)
        break
      default:
        throw new Error('Invalid value type')
    }

    this.writeOffset += 8
  }

  writeInt16BE (value) {
    this.resizeForWriteIfNeeded(2)
    this.buffer.writeInt16BE(value, this.writeOffset)
    this.writeOffset += 2
  }

  writeInt32BE (value) {
    this.resizeForWriteIfNeeded(4)
    this.buffer.writeInt32BE(value, this.writeOffset)
    this.writeOffset += 4
  }

  writeInt64BE (value) {
    this.resizeForWriteIfNeeded(8)
    switch (typeof value) {
      case 'bigint':
        this.buffer.writeBigInt64BE(value, this.writeOffset)
        break
      case 'number':
        this.buffer.writeInt32BE(Math.floor(value / 4294967296), this.writeOffset)
        this.buffer.writeInt32BE(value & 0xffffffff, this.writeOffset + 4)
        break
      default:
        throw new Error('Invalid value type')
    }

    this.writeOffset += 8
  }

  // Write floats

  writeFloatBE (value) {
    this.resizeForWriteIfNeeded(4)
    this.buffer.writeFloatBE(value, this.writeOffset)
    this.writeOffset += 4
  }

  writeDoubleBE (value) {
    this.resizeForWriteIfNeeded(8)
    this.buffer.writeDoubleBE(value, this.writeOffset)
    this.writeOffset += 8
  }

  // Read
  readUInt8 () {
    const value = this.buffer.readUInt8(this.readOffset)
    this.readOffset += 1
    return value
  }

  readUInt16LE () {
    const value = this.buffer.readUInt16LE(this.readOffset)
    this.readOffset += 2
    return value
  }

  readUInt32LE () {
    const value = this.buffer.readUInt32LE(this.readOffset)
    this.readOffset += 4
    return value
  }

  readUInt64LE () {
    const value = this.buffer.readBigUInt64LE(this.readOffset)
    this.readOffset += 8
    return value
  }

  readUInt16BE () {
    const value = this.buffer.readUInt16BE(this.readOffset)
    this.readOffset += 2
    return value
  }

  readUInt32BE () {
    const value = this.buffer.readUInt32BE(this.readOffset)
    this.readOffset += 4
    return value
  }

  readUInt64BE () {
    const value = this.buffer.readBigUInt64BE(this.readOffset)
    this.readOffset += 8
    return value
  }

  readInt8 () {
    const value = this.buffer.readInt8(this.readOffset)
    this.readOffset += 1
    return value
  }

  readInt16LE () {
    const value = this.buffer.readInt16LE(this.readOffset)
    this.readOffset += 2
    return value
  }

  readInt32LE () {
    const value = this.buffer.readInt32LE(this.readOffset)
    this.readOffset += 4
    return value
  }

  readInt64LE () {
    const value = this.buffer.readBigInt64LE(this.readOffset)
    this.readOffset += 8
    return value
  }

  // Strings
  writeStringNT (value, encoding = 'utf8') {
    const byteLength = Buffer.byteLength(value, encoding) + 1
    this.resizeForWriteIfNeeded(byteLength)
    this.buffer.write(value, this.writeOffset, value.length, encoding)
    this.buffer[this.writeOffset + value.length] = 0 // Null terminator
    this.writeOffset += value.length + 1
  }

  writeStringRaw (value, encoding = 'utf8') {
    const byteLength = Buffer.byteLength(value, encoding)
    this.resizeForWriteIfNeeded(byteLength)
    this.buffer.write(value, this.writeOffset, value.length, encoding)
    this.writeOffset += byteLength
  }

  writeBuffer (value) {
    this.resizeForWriteIfNeeded(value.byteLength)
    value.copy(this.buffer, this.writeOffset)
    this.writeOffset += value.byteLength
  }

  readBuffer (length) {
    const value = this.buffer.slice(this.readOffset, this.readOffset + length)
    this.readOffset += length
    return value
  }

  // Varints

  // Write a signed varint
  writeVarInt (value) {
    this.resizeForWriteIfNeeded(9)
    let offset = 0
    while (value >= 0x80) {
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
    let offset = 0
    while (value >= 0x80n) {
      this.buffer[this.writeOffset + offset] = Number((value & 0x7fn) | 0x80n)
      value = value >>> 7n
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
      value |= (byte & 0x7fn) << BigInt(7 * offset)
      offset += 1n
    } while (byte & 0x80n)
    this.readOffset += Number(offset)
    return value
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
    const value = this.readVarInt()
    return (value >>> 1n) ^ -(value & 1n)
  }

  // Extra

  peekUInt8 () {
    return this.buffer[this.readOffset]
  }

  peek () {
    return this.buffer[this.readOffset]
  }

  getBuffer () {
    return this.buffer.slice(0, this.writeOffset)
  }
}

module.exports = ByteStream
