/// <reference types="probs" />

/** @type {ProbsConfig} */
const options = {
    ignore: [
        '**/temp/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/e2e/**/app/**',
    ],
    worker: ({ file }) => ({
        execArgv: [
            '--experimental-specifier-resolution=node',
            '--experimental-loader=esm-loader-svelte',
        ],
    }),
}
export default options
