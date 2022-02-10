/// <reference types="probs" />

/** @type {ProbsConfig} */
const options = {
    worker: ({ file }) => {
        return {
            execArgv: ['--experimental-loader', 'svelte-esm-loader'],
        }
    },
}
export default options
