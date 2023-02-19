# sha1-uint8array

[![Node.js CI](https://github.com/kawanet/sha1-uint8array/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/sha1-uint8array/actions/)
[![npm version](https://img.shields.io/npm/v/sha1-uint8array)](https://www.npmjs.com/package/sha1-uint8array)
[![minified size](https://img.shields.io/bundlephobia/min/sha1-uint8array)](https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js)

Fast SHA-1 digest hash based on Uint8Array, pure JavaScript.

## SYNOPSIS

```js
const createHash = require("sha1-uint8array").createHash;

const text = "";
const hex = createHash().update(text).digest("hex");
// => "da39a3ee5e6b4b0d3255bfef95601890afd80709"

const data = new Uint8Array(0);
const hash = createHash().update(data).digest();
// => <Uint8Array da 39 a3 ee 5e 6b 4b 0d 32 55 bf ef 95 60 18 90 af d8 07 09>
```

See TypeScript declaration
[sha1-uint8array.d.ts](https://github.com/kawanet/sha1-uint8array/blob/main/types/sha1-uint8array.d.ts)
for detail.

## COMPATIBILITY

It has a better compatibility with Node.js's `crypto` module in its smaller footprint.

|module|string IN|Uint8Array IN|TypedArray IN|hex OUT|Uint8Array OUT|minified|
|---|---|---|---|---|---|---|
|[crypto](https://nodejs.org/api/crypto.html)|✅ OK|✅ OK|✅ OK|✅ OK|✅ OK|-|
|[sha1-uint8array](http://github.com/kawanet/sha1-uint8array)|✅ OK|✅ OK|✅ OK|✅ OK|✅ OK|3KB|
|[hash.js](https://www.npmjs.com/package/hash.js)|✅ OK|✅ OK|🚫 NO|✅ OK|✅ OK|17KB|
|[jssha](https://npmjs.com/package/jssha)|✅ OK|✅ OK|🚫 NO|✅ OK|✅ OK|10KB|
|[crypto-js](https://npmjs.com/package/crypto-js)|✅ OK|🚫 NO|🚫 NO|✅ OK|🚫 NO|109KB|
|[jshashes](https://npmjs.com/package/jshashes)|✅ OK|🚫 NO|🚫 NO|✅ OK|🚫 NO|23KB|
|[sha.js](https://npmjs.com/package/sha.js)|✅ OK|✅ OK|🚫 NO|✅ OK|✅ OK|26KB|
|[create-hash](https://npmjs.com/package/create-hash)|✅ OK|✅ OK|🚫 NO|✅ OK|✅ OK|95KB|
|[tiny-sha1](https://npmjs.com/package/tiny-sha1)|🚫 NO|✅ OK|🚫 NO|✅ OK|🚫 NO|2KB|
|[crypto.subtle.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)|🚫 NO|✅ OK|✅ OK|🚫 NO|🚫 NO|-|

The W3C standard `crypto.subtle.digest()` API has a different interface which
[returns](https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts)
`Promise<ArrayBuffer>`.

## SPEED

It runs well both on Node.js and browsers.
Node.js's native `crypto` module definitely runs faster than any others on Node.js, though.

|module|version|node.js V14|Chrome 87|Safari 14|
|---|---|---|---|---|
|[crypto](https://nodejs.org/api/crypto.html)|-|69ms 👍|N/A|N/A|
|[sha1-uint8array](http://github.com/kawanet/sha1-uint8array)|0.10.0|251ms|352ms 👍|202ms 👍|
|[hash.js](https://www.npmjs.com/package/hash.js)|1.1.7|500ms|619ms|882ms|
|[jssha](https://npmjs.com/package/jssha)|3.2.0|720ms|799ms|747ms|
|[crypto-js](https://npmjs.com/package/crypto-js)|4.0.0|765ms|842ms|991ms|
|[jshashes](https://npmjs.com/package/jshashes)|1.0.8|674ms|1,498ms|721ms|
|[sha.js](https://npmjs.com/package/sha.js)|2.4.11|361ms|964ms|3,487ms|

The benchmark above shows milliseconds for 20,000 times of
SHA-1 `hex` hash digest generation for approx 1KB string as input.
It is tested on macOS 10.15.7 Intel Core i7 3.2GHz.
You could run the benchmark as below.

```sh
git clone https://github.com/kawanet/sha1-uint8array.git
cd sha1-uint8array
npm install
npm run build

# run the benchmark on Node.js
REPEAT=10000 ./node_modules/.bin/mocha test/99.benchmark.js

# run tests and the benchmark on browser
make -C browser
open browser/test.html
```

## BROWSER

The minified version of the library is also available for browsers via
[jsDelivr](https://www.jsdelivr.com/package/npm/sha1-uint8array) CDN.

- Live Demo https://kawanet.github.io/sha1-uint8array/
- Minified https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js

```html
<script src="https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js"></script>
<script>
    const text = "";
    const hex = SHA1.createHash().update(text).digest("hex");
    // => "da39a3ee5e6b4b0d3255bfef95601890afd80709"
    
    const data = new Uint8Array(0);
    const hash = SHA1.createHash().update(data).digest();
    // => <Uint8Array da 39 a3 ee 5e 6b 4b 0d 32 55 bf ef 95 60 18 90 af d8 07 09>
</script>
```

## BROWSERIFY

It works great with
[browserify](https://www.npmjs.com/package/browserify)
via `browser` property of `package.json` of your app if you needs
`crypto.createHash("sha1").update(data).digest("hex");` syntax only.

```json
{
  "browser": {
    "crypto": "sha1-uint8array/dist/sha1-uint8array.min.js"
  },
  "devDependencies": {
    "browserify": "^17.0.0",
    "sha1-uint8array": "^0.10.0"
  }
}
```

It costs only less than 3KB, whereas `browserify`'s default `crypto` polyfill
costs more than 300KB huge even after minified.

```js
// On Node.js, this loads Node.js's native crypto module which is faster.
// On browsers, this uses sha1-uint8array.min.js which is small and fast.
const crypto = require("crypto");

const hash = crypto.createHash("sha1").update("").digest("hex");
// => "da39a3ee5e6b4b0d3255bfef95601890afd80709"
```

## LINKS

- https://www.npmjs.com/package/sha1-uint8array
- https://www.npmjs.com/package/sha256-uint8array
- https://github.com/kawanet/sha1-uint8array
- https://github.com/kawanet/sha1-uint8array/blob/main/types/sha1-uint8array.d.ts

## MIT LICENSE

Copyright (c) 2020-2023 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
