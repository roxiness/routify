/// <reference types="probs" />

/** @type {ProbsConfig} */
const options = {
    ignore: ['**/temp/**'],
    worker: ({ file }) => ({
        execArgv: [
            '--experimental-specifier-resolution=node',
            '--experimental-loader=esm-loader-svelte',
        ],
    }),
}
export default options
