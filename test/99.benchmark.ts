#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as A from "./utils/sha1-adapters";
import {MAKURANOSOSHI} from "./utils/sample-text";

const TESTNAME = __filename.replace(/^.*\//, "");

const isBrowser = ("undefined" !== typeof window);

const REPEAT = process.env.REPEAT || (isBrowser ? 10000 : 10000);

describe(TESTNAME, () => {
    const sampleJSON = JSON.stringify(require("../package.json"));
    const expectJSON = (new A.Crypto()).hash(sampleJSON);

    const sampleUTF8 = MAKURANOSOSHI;
    const expectUTF8 = (new A.Crypto()).hash(sampleUTF8);

    it("crypto", testFor(new A.Crypto()));

    it("sha1-uint8array", testFor(new A.SHA1Uint8Array()));

    it("hash.js", testFor(new A.HashJs()));

    it("jssha", testFor(new A.JsSHA()));

    it("crypto-js", testFor(new A.CryptoJs()));

    it("jshashes", testFor(new A.JsHashes()));

    it("tiny-sha1", testFor(new A.TinySha1()));

    it("sha.js", testFor(new A.ShaJS()));

    it("create-hash/browser", testFor(new A.CreateHash()));

    (A.SubtleCrypto.available ? it : it.skip)('crypto.subtle.digest()', testAsync(new A.SubtleCrypto()));

    function testFor(adapter: A.Adapter) {
        return function (this: Mocha.Context) {
            this.timeout(10000);

            for (let i = 0; i < REPEAT; i++) {
                assert.equal(adapter.hash(sampleJSON), expectJSON);
                assert.equal(adapter.hash(sampleUTF8), expectUTF8);
            }
        };
    }

    function testAsync(adapter: A.AsyncAdapter) {
        return async function (this: Mocha.Context) {
            this.timeout(10000);

            for (let i = 0; i < REPEAT; i++) {
                assert.equal(await adapter.hash(sampleJSON), expectJSON);
                assert.equal(await adapter.hash(sampleUTF8), expectUTF8);
            }
        };
    }
});
