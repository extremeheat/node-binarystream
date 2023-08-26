const ByteStream = require('binarystream')
const stream = new ByteStream()
stream.writeStringNT('hello world!')

console.log('Encoded hello world: ', stream.getBuffer())

const stream2 = new ByteStream()
stream2.writeStringNT('hello world!')
