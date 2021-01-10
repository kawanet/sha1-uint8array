/**
 * An interface which has sha1() method
 */

export interface SHA1Adapter {
    sha1(str: string): string;
}

/**
 * sha1-typedarray
 */

export class SHA1Uint8Array {
    private createHash = require("../../lib/sha1-uint8array").createHash;
    // private createHash = require("../../dist/sha1-uint8array.min").createHash;

    sha1(str: string): string {
        return this.createHash("sha1").update(str).digest("hex");
    }
}

/**
 * https://nodejs.org/api/crypto.html
 */

export class CryptoAdapter implements SHA1Adapter {
    private crypto = require("crypto");

    sha1(str: string): string {
        return this.crypto.createHash("sha1").update(str).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/create-hash
 */

export class CreateHash implements SHA1Adapter {
    private createHash = require("create-hash/browser");

    sha1(str: string): string {
        return this.createHash("sha1").update(str).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/crypto-js
 */

export class CryptoJsAdapter implements SHA1Adapter {
    private SHA1 = require("crypto-js/sha1");

    sha1(str: string): string {
        return this.SHA1(str).toString();
    }
}

/**
 * https://www.npmjs.com/package/jshashes
 */

export class JsHashesAdapter implements SHA1Adapter {
    private Hashes = require("jshashes");

    sha1(str: string): string {
        return new this.Hashes.SHA1().hex(str);
    }
}

/**
 * https://www.npmjs.com/package/jssha
 */

export class JsSHAAdapter implements SHA1Adapter {
    private jsSHA1 = require("jssha/dist/sha1");

    sha1(str: string): string {
        const shaObj = new this.jsSHA1("SHA-1", "TEXT");
        shaObj.update(str);
        return shaObj.getHash("HEX");
    }
}

/**
 * https://www.npmjs.com/package/sha.js
 */

export class ShaJSAdapter implements SHA1Adapter {
    private Sha1 = require("sha.js/sha1");

    sha1(str: string): string {
        return new this.Sha1().update(str).digest("hex");
    }
}

/**
 * https://www.npmjs.com/package/tiny-sha1
 */

export class TinySha1 implements SHA1Adapter {
    private TinySha1 = require("tiny-sha1");

    sha1(str: string): string {
        const buf = Buffer.from(str);
        return this.TinySha1(buf);
    }
}

/**
 * https://github.com/indutny/hash.js
 */

export class HashJs implements SHA1Adapter {
    private _sha1 = require("hash.js/lib/hash/sha/1");

    sha1(str: string): string {
        return this._sha1().update(str).digest('hex');
    }
}
