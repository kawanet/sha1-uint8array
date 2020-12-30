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

const TESTNAME = __filename.replace(/^.*\//, "");

describe(TESTNAME, () => {
    runTests("crypto", new CryptoAdapter());

    runTests("crypto-js", new CryptoJsAdapter());

    runTests("create-hash/browser", new CreateHash());

    runTests("jssha", new JsSHAAdapter());

    runTests("jshashes", new JsHashesAdapter());

    runTests("sha.js", new ShaJSAdapter());

    runTests("sha1-uint8array", new SHA1Uint8Array());

    runTests("tiny-sha1", new TinySha1());
});

function runTests(title: string, adapter: SHA1Adapter) {
    it(title, () => {
        {
            const input = ""; // 0 byte
            assert.equal(adapter.sha1(input), "da39a3ee5e6b4b0d3255bfef95601890afd80709", "empty");
        }

        {
            const input = "A"; // 1 byte
            assert.equal(adapter.sha1(input), "6dcd4ce23d88e2ee9568ba546c007c63d9131c1b", "1 byte");
        }

        {
            const input = "α"; // 2 bytes
            assert.equal(adapter.sha1(input), "6ebca356400287949b04fa5bf555e1981b80e784", "2 bytes");
        }

        {
            const input = "漢"; // 3 bytes
            assert.equal(adapter.sha1(input), "4f9f9d6e98756181266931323ed898250182a5c5", "3 bytes");
        }

        {
            const input = "\u{1F60D}"; // 4 bytes
            assert.equal(adapter.sha1(input), "a4019edcc896b89693ee04673c47510425be3c9f", "4 bytes");
        }

        {
            const input = "1234567890123456789012345678901234567890123456789012345678901234"; // 64 byte
            assert.equal(adapter.sha1(input), "c71490fc24aa3d19e11282da77032dd9cdb33103", "64 byte");
        }

        {
            const input = "Oh, wet Alex, a jar, a fag! Up, disk, curve by! Man Oz, Iraq, Arizona, my Bev? Ruck's id-pug, a far Ajax, elate? Who?"; // 117 bytes
            assert.equal(adapter.sha1(input), "8a6b5061c2724db215c1f23de00272f39bfa2cb5", shorten(input));
        }

        {
            const input = "Le cœur déçu mais l'âme plutôt naïve, Louÿs rêva de crapaüter en canoë au delà des îles, près du mälströn où brûlent les novæ."; // 144 bytes
            assert.equal(adapter.sha1(input), "4142d9c0caf72a8002e0da869dc26703269533be", shorten(input));
        }

        {
            const input = "Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich."; // 67 bytes
            assert.equal(adapter.sha1(input), "44a10786489a48d229b238b3290d3d750bc9b3a8", shorten(input));
        }

        {
            const input = "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja."; // 119 bytes
            assert.equal(adapter.sha1(input), "475ae9798e1129a81c644ec3702cbbd98a24a455", shorten(input));
        }
    });
}

function shorten(str: string) {
    return str.split(" ").slice(0, 4).join(" ");
}