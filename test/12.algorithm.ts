#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as crypto from "crypto";
import {createHash} from "../";

const TITLE = __filename.split("/").pop()!!;

describe(TITLE, () => {
    it('createHash("invalid")', () => {
        assert.throws(() => crypto.createHash("invalid"));

        assert.throws(() => createHash("invalid"));
    });

    it('createHash("sha1")', () => {
        assert.doesNotThrow(() => crypto.createHash("sha1"));

        assert.doesNotThrow(() => createHash("sha1"));
    });

    it('createHash("SHA1")', () => {
        assert.doesNotThrow(() => crypto.createHash("SHA1"));

        assert.doesNotThrow(() => createHash("SHA1"));
    });

    it('createHash(undefined)', () => {
        assert.throws(() => crypto.createHash(undefined as any));

        assert.doesNotThrow(() => createHash(undefined));
    });
});
