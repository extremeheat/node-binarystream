declare module "bytestream" {
  class ByteStream {
    private buffer: Buffer;
    private maxSize: number;
    private readOffset: number;
    private writeOffset: number;

    /**
     * 
     * @param buffer (optional) The starting buffer to use. If not specified, a new Buffer will be made with a small preallocation.
     * @param maxSize (optional) The max size this Buffer is allowed to grow to. Default is 2MB, consider a larger preallocation if needed.
     */
    constructor(buffer?: Buffer, maxSize?: number)

    readByte(): number

    // Write unsigned integers
    writeUInt8(value: number): void

    writeUInt16LE(value: number): void

    writeUInt32LE(value: number): void

    writeUInt64LE(value: bigint): void

    writeFloatLE(value: number): void

    writeDoubleLE(value: number): void

    writeUInt16BE(value: number): void

    writeUInt32BE(value: number): void

    writeUInt64BE(value: bigint): void

    // Write signed integers

    writeInt8(value: number): void

    writeInt16LE(value: number): void

    writeInt32LE(value: number): void

    writeInt64LE(value: bigint): void

    writeInt16BE(value: number): void

    writeInt32BE(value: number): void

    writeInt64BE(value: bigint): void

    // Write floats

    writeFloatBE(value: number): void

    writeDoubleBE(value: number): void

    // Read
    readUInt8(): number

    readUInt16LE(): number

    readUInt32LE(): number

    readUInt64LE(): bigint

    readUInt16BE(): number

    readUInt32BE(): number

    readUInt64BE(): bigint

    readInt8(): number

    readInt16LE(): number

    readInt32LE(): number

    readInt64LE(): bigint

    // Strings
    writeStringNT(value: string, encoding = 'utf8'): void

    writeStringRaw(value: string, encoding = 'utf8'): void

    writeBuffer(value: Buffer): void

    // Return a new Buffer containing the bytes written so far
    readBuffer(length: number): Buffer

    // Varints
    writeVarInt(value: number): void

    readVarInt(): void

    writeVarLong(value: bigint): void

    readVarLong(): void

    writeZigZagVarInt(value: number): void

    readZigZagVarInt(): number

    writeZigZagVarlong(value: bigint): void

    readZigZagVarlong(): bigint

    // Extra
    peekUInt8(): number

    peek(): number

    getBuffer(): Buffer
  }
  export = ByteStream
}