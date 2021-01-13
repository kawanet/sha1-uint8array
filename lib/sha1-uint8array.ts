/**
 * sha1-uint8array.ts
 */

const K = [
    0x5a827999 | 0,
    0x6ed9eba1 | 0,
    0x8f1bbcdc | 0,
    0xca62c1d6 | 0,
];

const enum N {
    inputBytes = 64,
    inputWords = inputBytes / 4,
    highIndex = inputWords - 2,
    lowIndex = inputWords - 1,
    workWords = 80,
    allocBytes = 80,
    allocWords = allocBytes / 4,
    allocTotal = allocBytes * 100,
}

const algorithms: { [algorithm: string]: number } = {
    sha1: 1,
};

export function createHash(algorithm?: string) {
    if (algorithm && !algorithms[algorithm] && !algorithms[algorithm.toLowerCase()]) {
        throw new Error("Digest method not supported");
    }
    return new Hash();
}

class Hash {
    private A = 0x67452301 | 0;
    private B = 0xefcdab89 | 0;
    private C = 0x98badcfe | 0;
    private D = 0x10325476 | 0;
    private E = 0xc3d2e1f0 | 0;
    private _byte: Uint8Array;
    private _word: Int32Array;
    private _size = 0;
    private _sp = 0; // surrogate pair

    constructor() {
        if (!sharedBuffer || sharedOffset >= N.allocTotal) {
            sharedBuffer = new ArrayBuffer(N.allocTotal);
            sharedOffset = 0;
        }

        this._byte = new Uint8Array(sharedBuffer, sharedOffset, N.allocBytes);
        this._word = new Int32Array(sharedBuffer, sharedOffset, N.allocWords);
        sharedOffset += N.allocBytes;
    }

    update(data: string, encoding?: string): this;
    update(data: Uint8Array): this;
    update(data: string | Uint8Array): this {
        if ("string" === typeof data) {
            return this._utf8(data);
        }

        const {_byte} = this;
        const length = data.length;

        for (let offset = 0; offset < length;) {
            const start = this._size % N.inputBytes;
            let index = start;

            while (offset < length && index < N.inputBytes) {
                _byte[index++] = data[offset++];
            }

            if (index >= N.inputBytes) {
                this._block();
            }

            this._size += index - start;
        }

        return this;
    }

    private _utf8(text: string): this {
        const {_byte, _word} = this;
        const length = text.length;
        let surrogate = this._sp;

        for (let offset = 0; offset < length;) {
            const start = this._size % N.inputBytes;
            let index = start;

            while (offset < length && index < N.inputBytes) {
                let code = text.charCodeAt(offset++) | 0;
                if (code < 0x80) {
                    // ASCII characters
                    _byte[index++] = code;
                } else if (code < 0x800) {
                    // 2 bytes
                    _byte[index++] = 0xC0 | (code >>> 6);
                    _byte[index++] = 0x80 | (code & 0x3F);
                } else if (code < 0xD800 || code > 0xDFFF) {
                    // 3 bytes
                    _byte[index++] = 0xE0 | (code >>> 12);
                    _byte[index++] = 0x80 | ((code >>> 6) & 0x3F);
                    _byte[index++] = 0x80 | (code & 0x3F);
                } else if (surrogate) {
                    // 4 bytes - surrogate pair
                    code = ((surrogate & 0x3FF) << 10) + (code & 0x3FF) + 0x10000;
                    _byte[index++] = 0xF0 | (code >>> 18);
                    _byte[index++] = 0x80 | ((code >>> 12) & 0x3F);
                    _byte[index++] = 0x80 | ((code >>> 6) & 0x3F);
                    _byte[index++] = 0x80 | (code & 0x3F);
                    surrogate = 0;
                } else {
                    surrogate = code;
                }
            }

            if (index >= N.inputBytes) {
                this._block();
                _word[0] = _word[N.inputWords];
            }

            this._size += index - start;
        }

        this._sp = surrogate;
        return this;
    }

    private _block(): void {
        const {_word} = this;
        let {A, B, C, D, E} = this;
        let i;

        for (i = 0; i < N.inputWords; i++) {
            W[i] = swap32(_word[i]);
        }

        for (i = N.inputWords; i < N.workWords; i++) {
            W[i] = rotate1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);
        }

        for (i = 0; i < N.workWords; i++) {
            const S = (i / 20) | 0;
            const T = (rotate5(A) + ft(S, B, C, D) + E + W[i] + K[S]) | 0;
            E = D;
            D = C;
            C = rotate30(B);
            B = A;
            A = T;
        }

        this.A = (A + this.A) | 0;
        this.B = (B + this.B) | 0;
        this.C = (C + this.C) | 0;
        this.D = (D + this.D) | 0;
        this.E = (E + this.E) | 0;
    }

    digest(): Uint8Array;
    digest(encoding: string): string;
    digest(encoding?: string) {
        const {_byte, _word} = this;
        let i = (this._size % N.inputBytes) | 0;
        _byte[i++] = 0x80;

        while (i & 3) {
            _byte[i++] = 0;
        }

        i >>= 2;

        if (i > N.highIndex) {
            while (i < N.allocWords) {
                _word[i++] = 0;
            }
            i = 0;
            this._block();
        }

        while (i < N.allocWords) {
            _word[i++] = 0;
        }

        const bits64 = this._size * 8;
        const low32 = (bits64 & 0xffffffff) >>> 0;
        const high32 = (bits64 - low32) / 0x100000000;
        if (high32) _word[N.highIndex] = swap32(high32);
        if (low32) _word[N.lowIndex] = swap32(low32);

        this._block();

        return (encoding === "hex") ? this._hex() : this._bin();
    }

    private _hex(): string {
        const {A, B, C, D, E} = this;

        return hex32(A) + hex32(B) + hex32(C) + hex32(D) + hex32(E);
    }

    private _bin(): Uint8Array {
        const {A, B, C, D, E, _byte, _word} = this;

        _word[0] = swap32(A);
        _word[1] = swap32(B);
        _word[2] = swap32(C);
        _word[3] = swap32(D);
        _word[4] = swap32(E);

        return _byte.slice(0, 20);
    }
}

type NS = (num: number) => string;
type NN = (num: number) => number;

const W = new Int32Array(N.workWords);

let sharedBuffer: ArrayBuffer;
let sharedOffset: number = 0;

const hex32: NS = num => (num + 0x100000000).toString(16).substr(-8);
const swapLE: NN = (c => (((c << 24) & 0xff000000) | ((c << 8) & 0xff0000) | ((c >> 8) & 0xff00) | ((c >> 24) & 0xff)));
const swapBE: NN = (c => c);
const swap32: NN = isBE() ? swapBE : swapLE;
const rotate1: NN = num => (num << 1) | (num >>> 31);
const rotate5: NN = num => (num << 5) | (num >>> 27);
const rotate30: NN = num => (num << 30) | (num >>> 2);

function ft(s: number, b: number, c: number, d: number) {
    if (s === 0) return (b & c) | ((~b) & d);
    if (s === 2) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

function isBE(): boolean {
    const buf = new Uint8Array(new Uint16Array([0xFEFF]).buffer); // BOM
    return (buf[0] === 0xFE);
}
