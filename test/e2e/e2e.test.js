import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import '#typedef'
import { chromium } from 'playwright'
import { setupRuntime } from './setup-runtime.js'

const test = suite('e2e')
/** @type {import('playwright').ChromiumBrowser} */
let browser

test.before(async () => {
    ;[browser] = await Promise.all([chromium.launch(), setupRuntime()])
})

test.after(async () => {
    await browser.close()
})

test('should see front page', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:3334')
    const result = await page.waitForSelector('"test suite"', { timeout: 100 })
    assert.ok(result)
    await new Promise(resolve => setTimeout(resolve, 200))
    await page.screenshot({ path: `example.png` })
    await browser.close()
})

test.run()
