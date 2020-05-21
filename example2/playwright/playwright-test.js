/// <reference types="ava/index" />
// @ts-check

/**
 * @callback MacroCallback
 * @param {import("ava").ExecutionContext<unknown>} t
 * @param {import("playwright").Page} page
 * @param {import("playwright").BrowserContext} context
 */

/**
 * 
 * @callback Macro
 * @param {import("ava").ExecutionContext<unknown>} t
 * @param {function} callback
 */

/**
 * @template {Macro} T
 * @param {string} name 
 * @param {T} macro 
 * @param {MacroCallback} callback 
 */
function test(name, macro, callback) {

}

const { chromium,firefox, webkit } = require('playwright');
const browserPromise = chromium.launch({ headless: false });

// @ts-ignore
test = require('ava');

/**
 * @template {MacroCallback} F
 * @param {import("ava").ExecutionContext<unknown>} t 
 * @param {F} callback 
 */
async function pageMacro(t, callback) {
    const browser = await browserPromise;
    const context = await browser.newContext()
    const page = await context.newPage();

    try {
        await callback(t, page, context);
    } finally {
        await page.close();
    }
}

/**
 * 
 * @param {string} name 
 * @param {MacroCallback} callback 
 */
function playwrightTest (name, callback){
    test(name, pageMacro, callback)
}

module.exports = playwrightTest