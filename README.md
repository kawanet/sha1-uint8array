# sha1-uint8array

[![Node.js CI](https://github.com/kawanet/sha1-uint8array/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/sha1-uint8array/actions/)
[![npm version](https://img.shields.io/npm/v/sha1-uint8array)](https://www.npmjs.com/package/sha1-uint8array)
[![gzip size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js?compression=gzip)](https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js)

Fast SHA-1 digest hash based on Uint8Array, pure JavaScript.

## SYNOPSIS

```js
import {createHash} from "sha1-uint8array";

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

## COMMONJS

Both ES Modules and CommonJS supported.

```js
const {createHash} = require("sha1-uint8array");
```

## COMPATIBILITY

It has a better compatibility with Node.js's `crypto` module in its smaller footprint.

|module|string IN|Uint8Array IN|TypedArray IN|hex OUT|Uint8Array OUT|minified|
|---|---|---|---|---|---|---|
|[crypto](https://nodejs.org/api/crypto.html)|✅ OK|✅ OK|✅ OK|✅ OK|✅ OK|-|
|[sha1-uint8array](http://github.com/kawanet/sha1-uint8array)|✅ OK|✅ OK|✅ OK|✅ OK|✅ OK|3KB|
|[hash.js](https://www.npmjs.com/package/hash.js)|✅ OK|✅ OK|🚫 NO|✅ OK|✅ OK|6KB|
|[jssha](https://npmjs.com/package/jssha)|✅ OK|✅ OK|🚫 NO|✅ OK|✅ OK|9KB|
|[crypto-js](https://npmjs.com/package/crypto-js)|✅ OK|🚫 NO|🚫 NO|✅ OK|🚫 NO|66KB|
|[sha.js](https://npmjs.com/package/sha.js)|✅ OK|✅ OK|🚫 NO|✅ OK|✅ OK|46KB|
|[@noble/hashes](https://www.npmjs.com/package/@noble/hashes)|🚫 NO|✅ OK|🚫 NO|✅ OK|✅ OK|7KB|
|[node-forge](https://www.npmjs.com/package/node-forge)|✅ OK|🚫 NO|🚫 NO|✅ OK|🚫 NO|27KB|
|[crypto.subtle.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)|🚫 NO|✅ OK|✅ OK|🚫 NO|🚫 NO|-|

The minified sizes are measured by `make -C browser/vendor`, which bundles
each library for browsers and runs it through terser.

The W3C standard `crypto.subtle.digest()` API has a different interface which
[returns](https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts)
`Promise<ArrayBuffer>`.

## SPEED

It runs well both on Node.js and browsers.
Node.js's native `crypto` module definitely runs faster than any others on Node.js, though.

|module|version|node.js V24 string|node.js V24 U8A|Chromium 151 string|Chromium 151 U8A|
|---|---|---|---|---|---|
|[crypto](https://nodejs.org/api/crypto.html)|-|31ms 🥇|20ms 🥇|N/A|N/A|
|[sha1-uint8array](http://github.com/kawanet/sha1-uint8array)|0.11.0|140ms 🥈|98ms 🥈|284ms 🥇|161ms|
|[hash.js](https://www.npmjs.com/package/hash.js)|1.1.7|483ms|480ms|459ms 🥈|568ms|
|[jssha](https://npmjs.com/package/jssha)|3.3.2|549ms|279ms|485ms|266ms|
|[crypto-js](https://npmjs.com/package/crypto-js)|4.2.0|627ms|N/A|731ms|N/A|
|[sha.js](https://npmjs.com/package/sha.js)|2.4.12|347ms|362ms|532ms|205ms|
|[@noble/hashes](https://www.npmjs.com/package/@noble/hashes)|2.3.0|N/A|103ms|N/A|157ms 🥈|
|[node-forge](https://www.npmjs.com/package/node-forge)|1.4.0|497ms|N/A|598ms|N/A|
|[crypto.subtle.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)|-|N/A|1,525ms|N/A|51ms 🥇|

The benchmark above shows milliseconds for 20,000 SHA-1 `hex` digests per
cell: `REPEAT=10000` hashes two samples per round, a 1.9KB JSON string and a
0.9KB UTF-8 text. Each cell is the median of five sets, taken in a single
run; every measurement is preceded by one untimed repeat, which absorbs
first-load effects. `N/A` marks an input shape
the library does not accept, and `-` a library that hands the digest to Node's
native `crypto` there instead of running its own JavaScript.
It is tested on Linux aarch64, Node.js v24.19.0 and Chromium 151.

You could run the benchmark as below.

```sh
git clone https://github.com/kawanet/sha1-uint8array.git
cd sha1-uint8array
npm install
npm run build

# run the benchmark on Node.js
npm run bench

# options via environment variables
REPEAT=10000 SETS=5 TARGET=sha1-uint8array,crypto-js npm run bench

# run the benchmark on a browser, options via the query string
open browser/bench.html   # ?REPEAT=10000&SETS=5&TARGET=sha1-uint8array
```

The runner prints one JSON line per cell — the measured sets, their median
and the median absolute deviation — followed by the Markdown table above.

## WEB BROWSERS

- The minified build of the library is also available for Web browsers via
[jsDelivr CDN](https://www.jsdelivr.com/package/npm/sha1-uint8array).
- https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js
- Live Demo https://kawanet.github.io/sha1-uint8array/

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

Copyright (c) 2020-2026 Yusuke Kawasaki

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
