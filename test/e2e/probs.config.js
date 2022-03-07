/// <reference types="probs" />

import { webkit } from 'playwright'
import { setupRuntime } from './setup-runtime.mjs'

let disposeServer, browser, context, page

/** @type {ProbsConfig} */
const options = {
    setupDir: async () => {
        disposeServer = await setupRuntime()
    },
    teardownDir: async () => {
        disposeServer()
    },
    setupFile: async () => {
        browser = await webkit.launch()
        context = await browser.newContext()
        page = await context.newPage()

        Object.assign(global, { browser, context, page })
    },
    teardownFile: async () => {
        browser.close()
        context.close()
        page.close()
    },
    worker: ({ file }) => {
        return {
            execArgv: ['--experimental-loader', 'svelte-esm-loader', '--no-warnings'],
        }
    },
    runner: 'fork',
}
export default options
