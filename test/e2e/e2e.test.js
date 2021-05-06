import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import '#typedef'
import { chromium } from 'playwright'
import { setupRuntime } from './setup-runtime.js'

/** @type {import('playwright').ChromiumBrowser} */
let browser
const promises = Promise.all([chromium.launch(), setupRuntime()])

const test = suite('e2e')
test.before(async () => {
    ;[browser] = await promises
})

test('should see front page', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:3334')
    const result = await page.waitForSelector('"test suite"', { timeout: 100 })
    assert.ok(result)
    page.close()
})

const navTest = suite('navigation')
navTest.after(async () => {
    // await browser.close()
})

navTest('Can click a link', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:3334')
    await page.waitForSelector('"test suite"', { timeout: 100 })
    await page.click('"blog"')
    const result = await page.waitForSelector('"My Blog"', { timeout: 100 })
    assert.ok(result)
    page.close()
})

test.run()

navTest.run()
