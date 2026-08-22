/**
 * An interface which has digest() method
 */

import {sha1 as noble} from "@noble/hashes/legacy.js"
import {bytesToHex} from "@noble/hashes/utils.js"
import cryptoJs from "crypto-js"
import hashJs from "hash.js/lib/hash/sha/1.js"
import jsSha from "jssha/dist/sha1"
import forgeSha from "node-forge/lib/sha1.js"
import {strict as assert} from "node:assert"
import * as nodeCrypto from "node:crypto"
import shaJs from "sha.js/sha1.js"
import {createHash as ownCreateHash} from "../../lib/sha1-uint8array.ts"
import {arrayToHex} from "./utils.ts"

export interface BenchPair<T> {
    data: T;
    expect: string;
}

/**
 * Base class for the adapters below: each subclass provides hash(), and
 * inherits the benchmark closure factories shared by the test suite and
 * the benchmark runner.
 */
export abstract class Adapter {
    // declare: type-only, so no own field shadows the subclass initializers
    declare noString?: boolean;
    declare noBinary?: boolean;
    declare noDataView?: boolean;
    declare noAsync?: boolean;
    declare noBench?: boolean;

    hash(_data: string | Uint8Array | ArrayBufferView): string {
        throw new Error("hash() not supported")
    }

    hashAsync(_data: Uint8Array<ArrayBuffer>): Promise<string> {
        throw new Error("hashAsync() not supported")
    }

    // Each call builds a fresh closure per adapter, so the hot loop's
    // hash() call site keeps its own feedback vector and stays
    // monomorphic; a loop shared on the prototype would go megamorphic
    // and skew the comparison between adapters.
    makeStringBench(pairs: BenchPair<string>[]): ((n: number) => void) | null {
        if (this.noBench || this.noString) return null
        return (n) => {
            for (let i = 0; i < n; i++) {
                for (const p of pairs) assert.equal(this.hash(p.data), p.expect)
            }
        }
    }

    makeBinaryBench(pairs: BenchPair<Uint8Array>[]): ((n: number) => void) | null {
        if (this.noBench || this.noBinary) return null
        return (n) => {
            for (let i = 0; i < n; i++) {
                for (const p of pairs) assert.equal(this.hash(p.data), p.expect)
            }
        }
    }

    // The async implementation of the binary input; only Promise-based
    // adapters override this. The default states there is none.
    makeBinaryBenchAsync(_pairs: BenchPair<Uint8Array<ArrayBuffer>>[]): ((n: number) => Promise<void>) | null {
        return null
    }
}

const isBrowser = ("undefined" !== typeof window)
const hasSubtle = ("undefined" !== typeof crypto) && crypto.subtle && ("function" === typeof crypto.subtle.digest)

/**
 * sha1-uint8array
 */

export class SHA1Uint8Array extends Adapter {
    private createHash = ownCreateHash;

    hash(data: string | Uint8Array | ArrayBufferView): string {
        const hash = this.createHash()
        if ("string" === typeof data) {
            hash.update(data) // same call either way: update() is overloaded, not union-typed
        } else {
            hash.update(data)
        }
        return hash.digest("hex")
    }
}

/**
 * https://nodejs.org/api/crypto.html
 */

export class Crypto extends Adapter {
    private crypto = nodeCrypto;
    noString = isBrowser;
    noBinary = isBrowser;

    hash(data: string | Uint8Array | ArrayBufferView): string {
        // BinaryLike covers the concrete views rather than the abstract
        // ArrayBufferView, so narrow before handing the value over.
        const input = "string" === typeof data ? data : new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
        return this.crypto.createHash("sha1").update(input).digest("hex")
    }
}

/**
 * https://www.npmjs.com/package/crypto-js
 */

export class CryptoJs extends Adapter {
    private CryptoJS = cryptoJs;
    noBinary = true;

    hash(data: string): string {
        return this.CryptoJS.SHA1(data).toString()
    }
}

/**
 * https://www.npmjs.com/package/jssha
 */

export class JsSHA extends Adapter {
    private jsSHA1 = jsSha;
    noDataView = true;

    hash(data: string): string {
        const type = ("string" === typeof data) ? "TEXT" : "UINT8ARRAY"
        const shaObj = new this.jsSHA1("SHA-1", type)
        shaObj.update(data)
        return shaObj.getHash("HEX")
    }
}

/**
 * https://www.npmjs.com/package/sha.js
 */

export class ShaJS extends Adapter {
    private Sha1 = shaJs;
    noDataView = true;

    hash(data: string | Uint8Array): string {
        return new this.Sha1().update(data).digest("hex")
    }
}

/**
 * https://github.com/indutny/hash.js
 */

export class HashJs extends Adapter {
    private hashJs = hashJs;
    noDataView = true;

    hash(data: string | Uint8Array): string {
        return this.hashJs().update(data).digest('hex')
    }
}

/**
 * https://www.npmjs.com/package/@noble/hashes
 *
 * Note: it rejects a string outright rather than guessing an encoding.
 */

export class Noble extends Adapter {
    private sha1 = noble;
    noString = true;
    noDataView = true;

    hash(data: Uint8Array): string {
        return bytesToHex(this.sha1(data))
    }
}

/**
 * https://www.npmjs.com/package/node-forge
 *
 * Note: the SHA-1 module is imported on its own; the package root
 * pulls in the whole crypto suite.
 */

export class NodeForge extends Adapter {
    private md = forgeSha;
    noBinary = true;

    hash(data: string): string {
        const md = this.md.create()
        // update() reads a string as latin1 unless the encoding is named.
        md.update(data, "utf8")
        return md.digest().toHex()
    }
}

/**
 * https://developer.mozilla.org/docs/Web/API/SubtleCrypto
 */

export class SubtleCrypto extends Adapter {
    // Both sync shapes stay opted out: this adapter only exists as the
    // async interface, gated by its own flag below.
    noString = true;
    noBinary = true;
    noAsync = !hasSubtle;

    async hashAsync(data: Uint8Array<ArrayBuffer>): Promise<string> {
        const digest = await crypto.subtle.digest("SHA-1", data)
        return arrayToHex(new Uint8Array(digest))
    }

    makeBinaryBenchAsync(pairs: BenchPair<Uint8Array<ArrayBuffer>>[]): ((n: number) => Promise<void>) | null {
        if (this.noBench || this.noAsync) return null
        return async (n) => {
            for (let i = 0; i < n; i++) {
                for (const p of pairs) assert.equal(await this.hashAsync(p.data), p.expect)
            }
        }
    }
}
