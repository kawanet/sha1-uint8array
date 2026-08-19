/**
 * An interface which has digest() method
 */

import createHashBrowser from "create-hash/browser.js";
import cryptoJs from "crypto-js";
import hashJs from "hash.js/lib/hash/sha/1.js";
import jsHashes from "jshashes";
import jsSha from "jssha/dist/sha1";
import * as nodeCrypto from "node:crypto";
import shaJs from "sha.js/sha1.js";
import {createHash as ownCreateHash} from "sha1-uint8array";
import tinySha1 from "tiny-sha1";
import {arrayToHex} from "./utils.ts";

export interface Adapter {
    noString?: boolean;
    noBinary?: boolean;
    noDataView?: boolean;

    hash(data: string | Uint8Array | ArrayBufferView): string;
}

export interface AsyncAdapter {
    noBinary?: boolean;

    hash(data: Uint8Array<ArrayBuffer>): Promise<string>;
}

const isBrowser = ("undefined" !== typeof window);
const hasSubtle = ("undefined" !== typeof crypto) && crypto.subtle && ("function" === typeof crypto.subtle.digest);

/**
 * sha1-uint8array
 */

export class SHA1Uint8Array implements Adapter {
    private createHash = ownCreateHash;

    hash(data: string | Uint8Array | ArrayBufferView): string {
        // update() is overloaded per input kind rather than accepting the
        // union, so branch to let one overload be selected.
        const hash = this.createHash();
        "string" === typeof data ? hash.update(data) : hash.update(data);
        return hash.digest("hex");
    }
}

/**
 * https://nodejs.org/api/crypto.html
 */

export class Crypto implements Adapter {
    private crypto = nodeCrypto;
    noString = isBrowser;
    noBinary = isBrowser;

    hash(data: string | Uint8Array | ArrayBufferView): string {
        // BinaryLike covers the concrete views rather than the abstract
        // ArrayBufferView, so narrow before handing the value over.
        const input = "string" === typeof data ? data : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        return this.crypto.createHash("sha1").update(input).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/create-hash
 *
 * Note: create-hash/browser calls sha.js internally.
 */

export class CreateHash implements Adapter {
    private createHash = createHashBrowser;
    noDataView = true;

    hash(data: string | Uint8Array): string {
        return this.createHash("sha1").update(data).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/crypto-js
 */

export class CryptoJs implements Adapter {
    private CryptoJS = cryptoJs;
    noBinary = true;

    hash(data: string): string {
        return this.CryptoJS.SHA1(data).toString();
    }
}

/**
 * https://www.npmjs.com/package/jshashes
 */

export class JsHashes implements Adapter {
    private Hashes = jsHashes;
    noBinary = true;

    hash(data: string): string {
        return new this.Hashes.SHA1().hex(data);
    }
}

/**
 * https://www.npmjs.com/package/jssha
 */

export class JsSHA implements Adapter {
    private jsSHA1 = jsSha;
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
    private Sha1 = shaJs;
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
    private TinySha1 = tinySha1;
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
    private hashJs = hashJs;
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

    async hash(data: Uint8Array<ArrayBuffer>): Promise<string> {
        const digest = await crypto.subtle.digest("SHA-1", data);
        return arrayToHex(new Uint8Array(digest));
    }
}
