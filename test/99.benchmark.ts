#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as A from "./utils/adapters";
import {MAKURANOSOSHI} from "./utils/sample-text";

const TITLE = __filename.split("/").pop()!!;

const isBrowser = ("undefined" !== typeof window);
const isLegacy = ("function" !== typeof TextEncoder);
const REPEAT = +(process.env.REPEAT || (isBrowser ? (isLegacy ? 1000 : 10000) : 10000));
const SLEEP = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const stringToArray = (str: string) => [].map.call(unescape(encodeURIComponent(str)), (c: string) => c.charCodeAt(0))

describe(`REPEAT=${REPEAT} ${TITLE}`, () => {

    const sampleJSON = JSON.stringify(require("../package.json"));
    const binaryJSON = new Uint8Array(stringToArray(sampleJSON));
    const expectJSON = (new A.Crypto()).hash(sampleJSON);

    const sampleUTF8 = MAKURANOSOSHI;
    const binaryUTF8 = new Uint8Array(stringToArray(sampleUTF8));
    const expectUTF8 = (new A.Crypto()).hash(sampleUTF8);

    describe("input: string => output: hex", () => {
        before(() => SLEEP(100));
        it("crypto", testFor(new A.Crypto()));
        it("sha1-uint8array", testFor(new A.SHA1Uint8Array()));
        it("hash.js", testFor(new A.HashJs()));
        it("jssha", testFor(new A.JsSHA()));
        it("crypto-js", testFor(new A.CryptoJs()));
        it("jshashes", testFor(new A.JsHashes()));
        it("tiny-sha1", testFor(new A.TinySha1()));
        it("sha.js", testFor(new A.ShaJS()));
    });

    describe("input: Uint8Array => output: hex", () => {
        before(() => SLEEP(100));
        it("crypto", testBinary(new A.Crypto()));
        it("sha1-uint8array", testBinary(new A.SHA1Uint8Array()));
        it("hash.js", testBinary(new A.HashJs()));
        it("jssha", testBinary(new A.JsSHA()));
        it("crypto-js", testBinary(new A.CryptoJs()));
        it("jshashes", testBinary(new A.JsHashes()));
        it("tiny-sha1", testBinary(new A.TinySha1()));
        it("sha.js", testBinary(new A.ShaJS()));
        it("crypto.subtle.digest()", testAsync(new A.SubtleCrypto()));
    });

    function testFor(adapter: A.Adapter) {
        return function (this: Mocha.Context): void {
            if (adapter.noString) return this.skip();
            this.timeout(10000);

            for (let i = 0; i < REPEAT; i++) {
                assert.equal(adapter.hash(sampleJSON), expectJSON);
                assert.equal(adapter.hash(sampleUTF8), expectUTF8);
            }
        };
    }

    function testBinary(adapter: A.Adapter) {
        return function (this: Mocha.Context): void {
            if (adapter.noBinary) return this.skip();
            this.timeout(10000);

            for (let i = 0; i < REPEAT; i++) {
                assert.equal(adapter.hash(binaryJSON), expectJSON);
                assert.equal(adapter.hash(binaryUTF8), expectUTF8);
            }
        };
    }

    function testAsync(adapter: A.AsyncAdapter) {
        return async function (this: Mocha.Context): Promise<void> {
            if (adapter.noBinary) return this.skip();
            this.timeout(10000);

            for (let i = 0; i < REPEAT; i++) {
                assert.equal(await adapter.hash(binaryJSON), expectJSON);
                assert.equal(await adapter.hash(binaryUTF8), expectUTF8);
            }
        };
    }
});
