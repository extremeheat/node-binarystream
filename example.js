const ByteStream = require('bytewriter')
const stream = new ByteStream()
stream.writeStringNT('hello world!')

console.log('Encoded hello world: ', stream.getBuffer())
