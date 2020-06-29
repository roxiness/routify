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

const { chromium, firefox, webkit } = require('playwright');
const browserPromise = chromium.launch({ headless: false });

// @ts-ignore
test = require('ava');
const serialTest = require('ava').serial;


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

// /** @typedef {function(string, MacroCallback):void} PlaywrightTest */

/**
 * @param {string} name 
 * @param {MacroCallback} callback 
 */
function playwrightTest(name, callback) {
    test(name, pageMacro, callback)
}

/**
 * Assign the project to an employee.
 * @param {string} name - The name of the employee.
 * @param {MacroCallback} callback - The employee's department.
 */
playwrightTest.serial = function(name, callback){
    serialTest(name, pageMacro, callback)
}

module.exports = playwrightTest