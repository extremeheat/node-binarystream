# node-bytewriter
[![NPM version](https://img.shields.io/npm/v/bytewriter.svg?logo=npm)](http://npmjs.com/package/bytewriter)
[![Build Status](https://img.shields.io/github/actions/workflow/status/extremeheat/node-binarystream/ci.yml.svg?label=CI&logo=github)](https://github.com/extremeheat/node-binarystream/actions?query=workflow%3A%22CI%22)
[![Try it on gitpod](https://img.shields.io/static/v1.svg?label=try&message=on%20gitpod&color=brightgreen&logo=gitpod)](https://gitpod.io/#https://github.com/extremeheat/node-binarystream)
[![PrismarineJS Discord](https://img.shields.io/static/v1.svg?label=PrismarineJS&message=Discord&color=blue&logo=discord)](https://discord.gg/GsEFRM8)

A simple zero-dep binary byte stream implementation for Node.js and the browser with support for reading and writing numbers, strings, and varints (zigzag or unsigned) in both little and big endian encoding.

## Install
```js
npm install bytewriter
```

## Usage

Simple example to create a new empty Buffer stream:

```js
const ByteStream = require('bytewriter')
const stream = new ByteStream()
stream.writeStringNT("hello world!") // write a string with a null term at end
const buffer = stream.getBuffer()
console.assert(buffer.equals(Buffer.from('hello world!\0'))
```

Load an existing one:
```js
const BinaryStream = require('bytewriter')
const stream = new BinaryStream(Buffer.from('10 10 10', 'hex'))
const a = stream.readUInt8()
const b = stream.readUInt16()
```

## API

See the [typescript types here for the full API](https://github.com/extremeheat/node-binarystream/blob/master/index.js)

## License
MIT
