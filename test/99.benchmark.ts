#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as A from "./utils/sha1-adapters";
import {MAKURANOSOSHI} from "./utils/sample-text";

const TESTNAME = __filename.replace(/^.*\//, "");

const isBrowser = ("undefined" !== typeof window);

const REPEAT = process.env.REPEAT || (isBrowser ? 100 : 100);

describe(TESTNAME, () => {
    const expects = {} as { [length: string]: string };

    before(() => {
        const adapter = new A.CryptoAdapter();

        for (let i = 1; i < MAKURANOSOSHI.length; i++) {
            const input = MAKURANOSOSHI.substring(0, i);
            expects[i] = adapter.sha1(input);
        }
    });

    runTests("crypto", new A.CryptoAdapter());

    runTests("crypto-js", new A.CryptoJsAdapter());

    runTests("create-hash/browser", new A.CreateHash());

    runTests("jssha", new A.JsSHAAdapter());

    runTests("jshashes", new A.JsHashesAdapter());

    runTests("sha.js", new A.ShaJSAdapter());

    runTests("sha1-uint8array", new A.SHA1Uint8Array());

    runTests("tiny-sha1", new A.TinySha1());

    function runTests(title: string, adapter: A.SHA1Adapter) {
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
