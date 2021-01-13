#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as crypto from "crypto";
import {createHash} from "../lib/sha1-uint8array";
import {MAKURANOSOSHI} from "./utils/sample-text";

const TESTNAME = __filename.replace(/^.*\//, "");

describe(TESTNAME, () => {
    it("0 byte to hex", () => {
        const input = ""; // 0 byte

        assert.equal(crypto.createHash("sha1").update(input).digest("hex"), "da39a3ee5e6b4b0d3255bfef95601890afd80709");
        assert.equal(createHash().update(input).digest("hex"), "da39a3ee5e6b4b0d3255bfef95601890afd80709");
    });

    it("0 byte to Uint8Array", () => {
        const input = ""; // 0 byte

        assert.equal(toHEX(crypto.createHash("sha1").update(input).digest()), "da-39-a3-ee-5e-6b-4b-0d-32-55-bf-ef-95-60-18-90-af-d8-07-09");
        assert.equal(toHEX(createHash().update(input).digest()), "da-39-a3-ee-5e-6b-4b-0d-32-55-bf-ef-95-60-18-90-af-d8-07-09");
    });

    it("43 bytes string", () => {
        const input = "The quick brown fox jumps over the lazy dog";

        assert.equal(crypto.createHash("sha1").update(input).digest("hex"), "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12");
        assert.equal(createHash().update(input).digest("hex"), "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12");
    });

    it("43 bytes Buffer", () => {
        const input = Buffer.from("The quick brown fox jumps over the lazy dog");

        assert.equal(crypto.createHash("sha1").update(input).digest("hex"), "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12");
        assert.equal(createHash().update(input).digest("hex"), "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12");
    });

    it("117 bytes string", () => {
        const input = "Oh, wet Alex, a jar, a fag! Up, disk, curve by! Man Oz, Iraq, Arizona, my Bev? Ruck's id-pug, a far Ajax, elate? Who?";

        assert.equal(crypto.createHash("sha1").update(input).digest("hex"), "8a6b5061c2724db215c1f23de00272f39bfa2cb5");
        assert.equal(createHash().update(input).digest("hex"), "8a6b5061c2724db215c1f23de00272f39bfa2cb5");
    });

    it("117 bytes Buffer", () => {
        const input = Buffer.from("Oh, wet Alex, a jar, a fag! Up, disk, curve by! Man Oz, Iraq, Arizona, my Bev? Ruck's id-pug, a far Ajax, elate? Who?");

        assert.equal(crypto.createHash("sha1").update(input).digest("hex"), "8a6b5061c2724db215c1f23de00272f39bfa2cb5");
        assert.equal(createHash().update(input).digest("hex"), "8a6b5061c2724db215c1f23de00272f39bfa2cb5");
    });

    it("multiple string updates", () => {
        const input = "Oh, wet Alex, a jar, a fag! Up, disk, curve by! Man Oz, Iraq, Arizona, my Bev? Ruck's id-pug, a far Ajax, elate? Who?";

        const hash = createHash("sha1");
        input.split("").forEach(c => hash.update(c));
        assert.equal(hash.digest("hex"), "8a6b5061c2724db215c1f23de00272f39bfa2cb5");
    });

    it("multiple Buffer updates", () => {
        const input = "Oh, wet Alex, a jar, a fag! Up, disk, curve by! Man Oz, Iraq, Arizona, my Bev? Ruck's id-pug, a far Ajax, elate? Who?";

        const hash = createHash("sha1");
        input.split("").forEach(c => hash.update(Buffer.from(c)));
        assert.equal(hash.digest("hex"), "8a6b5061c2724db215c1f23de00272f39bfa2cb5");
    });

    it("UTF-8 characters", () => {
        const input = MAKURANOSOSHI;
        assert.equal(crypto.createHash("sha1").update(input).digest("hex"), "4d803abf4a93e7b4094034935a0ec4502a67954a", "crypto");
        assert.equal(createHash().update(input).digest("hex"), "4d803abf4a93e7b4094034935a0ec4502a67954a", "single text at once");

        const hash = createHash("sha1");
        input.split(/(\n)/).forEach(s => hash.update(s));
        assert.equal(hash.digest("hex"), "4d803abf4a93e7b4094034935a0ec4502a67954a", "chunked text");
    });
});

const toHEX = (array: Uint8Array) => [].map.call(array, (c: number) => (c < 16 ? "0" : "") + c.toString(16)).join("-");
