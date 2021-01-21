/**
 * An interface which has digest() method
 */

export interface Adapter {
    hash(data: string | Uint8Array): string;
}

export interface AsyncAdapter {
    hash(data: string | Uint8Array): Promise<string>;
}

const isBrowser = ("undefined" !== typeof window);

/**
 * sha1-uint8array
 */

export class SHA1Uint8Array implements Adapter {
    private createHash = isBrowser
        ? require("../../dist/sha1-uint8array.min").createHash
        : require("../../lib/sha1-uint8array").createHash;

    hash(data: string | Uint8Array): string {
        return this.createHash().update(data).digest("hex");
    }
}

/**
 * https://nodejs.org/api/crypto.html
 */

export class Crypto implements Adapter {
    private crypto = require("crypto");

    hash(data: string | Uint8Array): string {
        return this.crypto.createHash("sha1").update(data).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/create-hash
 *
 * Note: create-hash/browser calls sha.js internally.
 */

export class CreateHash implements Adapter {
    private createHash = require("create-hash/browser");

    hash(data: string | Uint8Array): string {
        return this.createHash("sha1").update(data).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/crypto-js
 */

export class CryptoJs implements Adapter {
    private CryptoJS = require("crypto-js");

    hash(data: string | Uint8Array): string {
        if ("string" !== typeof data) throw new TypeError("Type not supported: " + typeof data);
        return this.CryptoJS.SHA1(data).toString();
    }
}

/**
 * https://www.npmjs.com/package/jshashes
 */

export class JsHashes implements Adapter {
    private Hashes = require("jshashes");

    hash(data: string | Uint8Array): string {
        if ("string" !== typeof data) throw new TypeError("Type not supported: " + typeof data);
        return new this.Hashes.SHA1().hex(data);
    }
}

/**
 * https://www.npmjs.com/package/jssha
 */

export class JsSHA implements Adapter {
    private jsSHA1 = require("jssha/dist/sha1");

    hash(data: string): string {
        const type = ("string" === typeof data) ? "TEXT" : "UINT8ARRAY";
        const shaObj = new this.jsSHA1("SHA-1", type);
        shaObj.update(data);
        return shaObj.getHash("HEX");
    }
}

/**
 * https://www.npmjs.com/package/sha.js
 */

export class ShaJS implements Adapter {
    private Sha1 = require("sha.js/sha1");

    hash(data: string | Uint8Array): string {
        return new this.Sha1().update(data).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/tiny-sha1
 */

export class TinySha1 implements Adapter {
    private TinySha1 = require("tiny-sha1");

    hash(data: string | Uint8Array): string {
        if ("string" === typeof data) throw new TypeError("Type not supported: " + typeof data);
        return this.TinySha1(data);
    }
}

/**
 * https://github.com/indutny/hash.js
 */

export class HashJs implements Adapter {
    private hashJs = require("hash.js/lib/hash/sha/1");

    hash(data: string | Uint8Array): string {
        return this.hashJs().update(data).digest('hex');
    }
}

/**
 * https://developer.mozilla.org/docs/Web/API/SubtleCrypto
 */

export class SubtleCrypto implements AsyncAdapter {
    static available = ("undefined" !== typeof crypto) && crypto.subtle && ("function" === typeof crypto.subtle.digest);

    async hash(data: string | Uint8Array): Promise<string> {
        if ("string" === typeof data) throw new TypeError("Type not supported: " + typeof data);
        const digest = await crypto.subtle.digest("SHA-1", data);
        return arrayBufferToHex(digest);
    }
}

function arrayBufferToHex(data: ArrayBuffer): string {
    const length = data.byteLength;
    const uint8 = new Uint8Array(data);
    let hex = "";
    for (let i = 0; i < length; i++) {
        hex += (uint8[i] | 0x100).toString(16).substr(-2);
    }
    return hex;
}