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
