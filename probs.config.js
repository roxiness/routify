/// <reference types="probs" />

/** @type {ProbsConfig} */
const options = {
    worker: ({ file }) => ({
        execArgv: [
            '--experimental-loader',
            'svelte-esm-loader',
            '--experimental-specifier-resolution',
            'node',
        ],
    }),
}
export default options
