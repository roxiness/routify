/// <reference types="probs" />

import expect from 'expect'
import { webkit } from 'playwright'

/** @type {ProbsConfig} */
const options = {
    setupFile: async () => {
        const browser = await webkit.launch()
        const context = await browser.newContext()
        global['page'] = await context.newPage()
        global['expect'] = expect
    },
    worker: ({ file }) => {
        return {
            execArgv: ['--experimental-loader', 'svelte-esm-loader', '--no-warnings'],
        }
    },
}
export default options
