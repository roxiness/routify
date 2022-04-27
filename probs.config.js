/// <reference types="probs" />

/** @type {ProbsConfig} */
const options = {
    ignore: ['**/temp/**'],
    worker: ({ file }) => ({
        execArgv: [
            '--experimental-loader',
            'esm-loader-svelte',
            '--experimental-specifier-resolution',
            'node',
        ],
    }),
}
export default options
