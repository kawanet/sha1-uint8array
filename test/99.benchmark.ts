#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {
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

const REPEAT = process.env.REPEAT || 10;
const TEST_LESS = process.env.TEST_LESS || false;

describe(TESTNAME, () => {
    const expects = {} as { [length: string]: string };

    before(() => {
        const adapter = new CryptoAdapter();

        for (let i = 1; i < MAKURANOSOSHI.length; i++) {
            const input = MAKURANOSOSHI.substring(0, i);
            expects[i] = adapter.sha1(input);
        }
    });

    if (!TEST_LESS) runTests("crypto", new CryptoAdapter());

    if (!TEST_LESS) runTests("crypto-js", new CryptoJsAdapter());

    if (!TEST_LESS) runTests("jssha", new JsSHAAdapter());

    if (!TEST_LESS) runTests("jshashes", new JsHashesAdapter());

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
