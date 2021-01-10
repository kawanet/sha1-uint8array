/**
 * An interface which has digest() method
 */

export interface Adapter {
    hash(str: string): string;
}

/**
 * sha1-uint8array
 */

export class SHA1Uint8Array implements Adapter {
    private createHash = require("../../lib/sha1-uint8array").createHash;

    // private createHash = require("../../dist/sha1-uint8array.min").createHash;

    hash(str: string): string {
        return this.createHash("sha1").update(str).digest("hex");
    }
}

/**
 * https://nodejs.org/api/crypto.html
 */

export class Crypto implements Adapter {
    private crypto = require("crypto");

    hash(str: string): string {
        return this.crypto.createHash("sha1").update(str).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/create-hash
 */

export class CreateHash implements Adapter {
    private createHash = require("create-hash/browser");

    hash(str: string): string {
        return this.createHash("sha1").update(str).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/crypto-js
 */

export class CryptoJs implements Adapter {
    private SHA1 = require("crypto-js/sha1");

    hash(str: string): string {
        return this.SHA1(str).toString();
    }
}

/**
 * https://www.npmjs.com/package/jshashes
 */

export class JsHashes implements Adapter {
    private Hashes = require("jshashes");

    hash(str: string): string {
        return new this.Hashes.SHA1().hex(str);
    }
}

/**
 * https://www.npmjs.com/package/jssha
 */

export class JsSHA implements Adapter {
    private jsSHA1 = require("jssha/dist/sha1");

    hash(str: string): string {
        const shaObj = new this.jsSHA1("SHA-1", "TEXT");
        shaObj.update(str);
        return shaObj.getHash("HEX");
    }
}

/**
 * https://www.npmjs.com/package/sha.js
 */

export class ShaJS implements Adapter {
    private Sha1 = require("sha.js/sha1");

    hash(str: string): string {
        return new this.Sha1().update(str).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/tiny-sha1
 */

export class TinySha1 implements Adapter {
    private TinySha1 = require("tiny-sha1");

    hash(str: string): string {
        const buf = Buffer.from(str);
        return this.TinySha1(buf);
    }
}

/**
 * https://github.com/indutny/hash.js
 */

export class HashJs implements Adapter {
    private hashJs = require("hash.js/lib/hash/sha/1");

    hash(str: string): string {
        return this.hashJs().update(str).digest('hex');
    }
}
