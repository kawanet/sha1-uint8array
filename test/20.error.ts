#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as crypto from "crypto";
import {createHash} from "../lib/sha1-uint8array";

const TESTNAME = __filename.replace(/^.*\//, "");

describe(TESTNAME, () => {
    it("Error: Digest method not supported", () => {
        assert.throws(() => crypto.createHash("invalid"));

        assert.throws(() => createHash("invalid"), 'createHash("invalid")');

        assert.doesNotThrow(() => createHash("sha1"), 'createHash("sha1")');

        assert.doesNotThrow(() => createHash(), 'createHash()');
    });
});
