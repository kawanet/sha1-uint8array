/**
 * An interface which has digest() method
 */

import {arrayToHex} from "./utils";

export interface Adapter {
    noString?: boolean;
    noBinary?: boolean;
    noDataView?: boolean;

    hash(data: string | Uint8Array | ArrayBufferView): string;
}

export interface AsyncAdapter {
    noBinary?: boolean;

    hash(data: Uint8Array): Promise<string>;
}

const isBrowser = ("undefined" !== typeof window);
const hasSubtle = ("undefined" !== typeof crypto) && crypto.subtle && ("function" === typeof crypto.subtle.digest);

/**
 * sha1-uint8array
 */

export class SHA1Uint8Array implements Adapter {
    private createHash = isBrowser
        ? require("../../dist/sha1-uint8array.min").createHash
        : require("../../lib/sha1-uint8array").createHash;

    hash(data: string | Uint8Array | ArrayBufferView): string {
        return this.createHash().update(data).digest("hex");
    }
}

/**
 * https://nodejs.org/api/crypto.html
 */

export class Crypto implements Adapter {
    private crypto = require("crypto");
    noString = isBrowser;
    noBinary = isBrowser;

    hash(data: string | Uint8Array | ArrayBufferView): string {
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
    noDataView = true;

    hash(data: string | Uint8Array): string {
        return this.createHash("sha1").update(data).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/crypto-js
 */

export class CryptoJs implements Adapter {
    private CryptoJS = require("crypto-js");
    noBinary = true;

    hash(data: string): string {
        return this.CryptoJS.SHA1(data).toString();
    }
}

/**
 * https://www.npmjs.com/package/jshashes
 */

export class JsHashes implements Adapter {
    private Hashes = require("jshashes");
    noBinary = true;

    hash(data: string): string {
        return new this.Hashes.SHA1().hex(data);
    }
}

/**
 * https://www.npmjs.com/package/jssha
 */

export class JsSHA implements Adapter {
    private jsSHA1 = require("jssha/dist/sha1");
    noDataView = true;

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
    noDataView = true;

    hash(data: string | Uint8Array): string {
        return new this.Sha1().update(data).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/tiny-sha1
 *
 * Note: tiny-sha1 only supports Uint8Array but not even string.
 */

export class TinySha1 implements Adapter {
    private TinySha1 = require("tiny-sha1");
    noString = true;
    noDataView = true;

    hash(data: Uint8Array): string {
        return this.TinySha1(data);
    }
}

/**
 * https://github.com/indutny/hash.js
 */

export class HashJs implements Adapter {
    private hashJs = require("hash.js/lib/hash/sha/1");
    noDataView = true;

    hash(data: string | Uint8Array): string {
        return this.hashJs().update(data).digest('hex');
    }
}

/**
 * https://developer.mozilla.org/docs/Web/API/SubtleCrypto
 */

export class SubtleCrypto implements AsyncAdapter {
    noString = true;
    noBinary = !hasSubtle;

    async hash(data: Uint8Array): Promise<string> {
        const digest = await crypto.subtle.digest("SHA-1", data);
        return arrayToHex(new Uint8Array(digest));
    }
}
