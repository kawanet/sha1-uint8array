#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {
    CreateHash,
    CryptoAdapter,
    CryptoJsAdapter,
    JsHashesAdapter,
    JsSHAAdapter,
    SHA1Adapter,
    SHA1Uint8Array,
    ShaJSAdapter,
    TinySha1
} from "./utils/sha1-adapters";
import {MAKURANOSOSHI} from "./utils/sample-text";

const TESTNAME = __filename.replace(/^.*\//, "");

const isBrowser = ("undefined" !== typeof window);

const REPEAT = process.env.REPEAT || (isBrowser ? 100 : 100);

describe(TESTNAME, () => {
    const expects = {} as { [length: string]: string };

    before(() => {
        const adapter = new CryptoAdapter();

        for (let i = 1; i < MAKURANOSOSHI.length; i++) {
            const input = MAKURANOSOSHI.substring(0, i);
            expects[i] = adapter.sha1(input);
        }
    });

    runTests("crypto", new CryptoAdapter());

    runTests("crypto-js", new CryptoJsAdapter());

    runTests("create-hash/browser", new CreateHash());

    runTests("jssha", new JsSHAAdapter());

    runTests("jshashes", new JsHashesAdapter());

    runTests("sha.js", new ShaJSAdapter());

    runTests("sha1-uint8array", new SHA1Uint8Array());

    runTests("tiny-sha1", new TinySha1());

    function runTests(title: string, adapter: SHA1Adapter) {
        it(title, function () {
            this.timeout(10000);

            for (let repeat = 1; repeat < REPEAT; repeat++) {
                for (let i = 1; i < MAKURANOSOSHI.length; i++) {
                    const input = MAKURANOSOSHI.substring(0, i);
                    assert.equal(adapter.sha1(input), expects[i], `${i} characters`);
                }
            }
        });
    }
});
