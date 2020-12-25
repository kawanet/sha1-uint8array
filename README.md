# sha1-uint8array

[![Node.js CI](https://github.com/kawanet/sha1-uint8array/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/kawanet/sha1-uint8array/actions/)
[![npm version](https://badge.fury.io/js/sha1-uint8array.svg)](https://www.npmjs.com/package/sha1-uint8array)

## SYNOPSIS

```js
const createHash = require("sha1-uint8array").createHash;

const text = "";
const hash1 = createHash("sha1").update(text).digest("hex");
// => "da39a3ee5e6b4b0d3255bfef95601890afd80709"

const data = new Uint8Array(0);
const hash2 = createHash("sha1").update(data).digest();
// => <Uint8Array da 39 a3 ee 5e 6b 4b 0d 32 55 bf ef 95 60 18 90 af d8 07 09>
```

See TypeScript declaration
[sha1-uint8array.d.ts](https://github.com/kawanet/sha1-uint8array/blob/master/types/sha1-uint8array.d.ts)
for detail.

## BENCHMARK

Node.js's native `crypto` module run faster than others on Node.js.
`sha1-uint8array` runs well both on Node.js and browsers with its smaller footprint.

|module|version|node.js V14|Chrome 87|minified|backend|note|
|---|---|---|---|---|---|---|
|[crypto](https://nodejs.org/api/crypto.html)|-|97ms|-|-|OpenSSL||
|[sha1-uint8array](http://github.com/kawanet/sha1-uint8array)|0.1.0|239ms|408ms|2KB|Uint8Array|👍|
|[tiny-sha1](https://npmjs.com/package/tiny-sha1)|0.2.1|213ms|570ms|2KB|Uint8Array|tiny-sha1/dist/tiny-sha1.js|
|[jssha](https://npmjs.com/package/jssha)|3.2.0|515ms|627ms|9KB|Uint8Array|jssha/dist/sha1.js|
|[sha.js](https://npmjs.com/package/sha.js)|2.4.11|335ms|715ms|26KB|Buffer|sha.js/sha1.js|
|[create-hash](https://npmjs.com/package/create-hash)|1.2.0|419ms|756ms|97KB|Buffer|create-hash/browser.js|
|[crypto-js](https://npmjs.com/package/crypto-js)|4.0.0|722ms|821ms|38KB|Buffer|crypto-js/sha1.js|
|[jshashes](https://npmjs.com/package/jshashes)|1.0.8|580ms|1,123ms|23KB|Array|jshashes/hashes.js|

The benchmark source code is included in the git repository.

```sh
# run the benchmark on Node.js
REPEAT=100 mocha test/99.benchmark.js

# run tests and the benchmark on browser
make test-browser
```

## BROWSER

- https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js

```html
<script src="https://cdn.jsdelivr.net/npm/sha1-uint8array/dist/sha1-uint8array.min.js"></script>
<script>
    const text = "";
    const hash1 = createHash("sha1").update(text).digest("hex");
    // => "da39a3ee5e6b4b0d3255bfef95601890afd80709"
</script>
```

## MIT License

Copyright (c) 2020 Yusuke Kawasaki

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
