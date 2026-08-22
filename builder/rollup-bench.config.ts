import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import inject from "@rollup/plugin-inject"
import json from "@rollup/plugin-json"
import nodeResolve from "@rollup/plugin-node-resolve"
import sucrase from "@rollup/plugin-sucrase"
import {fileURLToPath} from "node:url"
import type {RollupOptions} from "rollup"
import {showFiles} from "./show-files.ts"

const here = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

// Builds the benchmark runner twice from the same source: an ESM file
// any supported Node.js runs against node_modules' published packages,
// and an IIFE for browser/bench.html running the vendored builds.
// The two stay separate on purpose: each environment must measure the
// artifacts its consumers actually load.

const sucrasePlugin = () => sucrase({
    disableESTransforms: true,
    exclude: ["node_modules/**"],
    transforms: ["typescript"],
})

const nodeConfig: RollupOptions = {
    input: "./bench.cli.ts",

    // Bare specifiers stay external; only relative paths are bundled.
    external: /^[^.\/]/,

    output: {
        file: "./tests/bench.mjs",
        format: "esm",
    },

    treeshake: false,

    plugins: [
        alias({
            entries: [
                // The adapters import the entry point by relative path;
                // rewrite it to the package name so the run measures the
                // dist/ bundle a consumer loads, not the sources.
                {find: /^(\.\.\/)+lib\/sha1-uint8array\.ts$/, replacement: "sha1-uint8array"},
            ],
        }),

        nodeResolve({
            preferBuiltins: true,
        }),

        sucrasePlugin(),

        showFiles(),
    ],
}

const browserConfig: RollupOptions = {
    input: "./bench.cli.ts",

    /**
     * browser/bench.html
     * browser/vendor/Makefile
     */
    external: [
        "@noble/hashes/legacy.js",
        "@noble/hashes/utils.js",
        "crypto-js",
        "hash.js/lib/hash/sha/1.js",
        "jssha/dist/sha1",
        "node-forge/lib/sha1.js",
        "sha.js/sha1.js",
    ],

    output: {
        file: "../browser/tests/bench.js",
        format: "iife",
        globals: {
            "@noble/hashes/legacy.js": "noble_hashes_legacy",
            "@noble/hashes/utils.js": "noble_hashes_utils",
            "crypto-js": "crypto_js_index",
            "hash.js/lib/hash/sha/1.js": "hash_js_lib_hash_sha_1",
            "jssha/dist/sha1": "jssha_dist_sha1",
            "node-forge/lib/sha1.js": "node_forge_lib_sha1",
            "sha.js/sha1.js": "sha_js_sha1",
        },
    },

    treeshake: false,

    plugins: [
        // Node-only imports resolve to local stand-ins; the package
        // itself resolves to the shim reading the global left behind by
        // dist/*.min.js, so the browser measures the shipped bundle.
        alias({
            entries: [
                {find: "node:assert", replacement: here("./node-assert.shim.ts")},
                {find: "node:crypto", replacement: here("./node-crypto.shim.ts")},
                {find: "sha1-uint8array", replacement: here("../browser/import.js")},
                {find: /^(\.\.\/)+lib\/sha1-uint8array\.ts$/, replacement: here("../browser/import.js")},
            ],
        }),

        nodeResolve({
            browser: true,
            preferBuiltins: false,
        }),

        commonjs(),

        json(),

        sucrasePlugin(),

        // Globals cannot be aliased, so they are injected instead. This
        // has to run after sucrase: the plugin parses with acorn and
        // would skip any file still carrying TypeScript syntax.
        inject({
            Buffer: [here("./buffer.shim.ts"), "Buffer"],
            process: [here("./process.shim.ts"), "process"],
        }),

        showFiles(),
    ],
}

export default [nodeConfig, browserConfig]
