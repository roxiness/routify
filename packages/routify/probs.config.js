/// <reference types="probs" />

import expect from 'expect'

/** @type {ProbsConfig} */
const options = {
    setupFile: () => {
        global['expect'] = expect
    },
    worker: ({ file }) => {
        return {
            execArgv: ['--experimental-loader', 'svelte-esm-loader', '--no-warnings'],
        }
    },
}
export default options
