import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import inject from "@rollup/plugin-inject"
import json from "@rollup/plugin-json"
import multiEntry from "@rollup/plugin-multi-entry"
import nodeResolve from "@rollup/plugin-node-resolve"
import sucrase from "@rollup/plugin-sucrase"
import {fileURLToPath} from "node:url"
import type {RollupOptions} from "rollup"
import {showFiles} from "./show-files.ts"

const here = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

const rollupConfig: RollupOptions = {
    input: ["../test/*.test.ts"],

    // Bare specifiers stay external; only relative paths are bundled.
    external: v => /^[^./]/.test(v) && (v !== "multi-entry.js"),

    output: {
        file: "../browser/tests/bundled.mjs",
        format: "esm",
    },

    treeshake: false,

    plugins: [
        // Everything the suites reach for that only exists on Node resolves
        // to a local stand-in here. The package itself resolves to the shim
        // that reads the global left behind by dist/*.min.js, so the browser
        // run exercises the published artifact rather than the sources.
        alias({
            entries: [
                {find: /^(\.\.\/)+lib\/sha1-uint8array\.ts$/, replacement: here("../browser/import.js")},
            ],
        }),

        multiEntry(),

        nodeResolve({
            browser: true,
            preferBuiltins: false,
        }),

        // Several of the compared implementations ship as CommonJS, and one
        // of them carries a JSON data file.
        commonjs(),

        json(),

        sucrase({
            disableESTransforms: true,
            exclude: ["node_modules/**"],
            transforms: ["typescript"],
        }),

        // Globals cannot be aliased, so they are injected instead. This has
        // to run after sucrase: the plugin parses with acorn and would skip
        // any file that still carried TypeScript syntax.
        inject({
            Buffer: [here("./buffer.shim.ts"), "Buffer"],
            process: [here("./process.shim.ts"), "process"],
        }),

        showFiles(),
    ],
}

export default rollupConfig
