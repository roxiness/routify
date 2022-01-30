import test from 'ava'
import { chromium } from 'playwright'

// /** @type {import('playwright').ChromiumBrowser} */
// let browser
// const promises = Promise.all([chromium.launch(), setupRuntime()])

// test.before(async () => {
//     console.log('starting')
//     ;[browser] = await promises
// })

// test.after(async () => {
//     console.log('shutting down')
//     browser.close()
// })

test('nested thing', async t => {
    console.log(t.context)
    t.assert(true)
})
