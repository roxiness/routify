const test = require('../../playwright-test')


test('Site should be online', async (t, page) => {
    await page.goto('http://localhost:5000');
    t.is(await page.title(), 'Svelte app');
});

test('Unvisited site is unavailable offline', async (t, page, context) => {
    await context.setOffline(true)
    let err
    try { await page.goto('http://localhost:5000'); }
    catch (_err) { err = _err }
    await t.regex(err.message, /ERR_INTERNET_DISCONNECTED|NS_ERROR_FAILURE/)
});

test('It works offline', async (t, page, context) => {
    await page.goto('http://localhost:5000')
    await page.waitForSelector('"Just installed"')
    await context.setOffline(true)
    await page.goto('http://localhost:5000/fetch')
    const element = await page.$('"/fetch/index.svelte"')
    await t.truthy(element)
})

test('Prefetched pages have data', async (t, page, context) => {
    await page.goto('http://localhost:5000/fetch/prefetch/custom-referrer')
    await page.waitForSelector('"Just installed"')
    await page.$('#options').then(elem =>
        elem.fill(JSON.stringify({ "headers": { "x-delay": 1000 } })))
    await page.click('#prefetch')

    await new Promise(resolve => setTimeout(resolve, 1200))

    await page.click('#goto')
    const element = await page.waitForSelector('#result_date')
    t.assert(element)
})

test('headers are written with writeHeaders', async (t, page, context) => {
    await page.goto('http://localhost:5000/fetch/prefetch/custom-referrer')
    await page.waitForSelector('"Just installed"')
    await page.$('#options').then(elem =>
        elem.fill(JSON.stringify({
            "headers": {
                "x-delay": 0,
                "x-routify-valid-for": 5,
                "x-routify-write-headers": true
            }
        })))
    await page.click('#goto')

    const element = await page.waitForSelector('#result_date')
    t.assert(element)
})

// todo wait for Playwright to fix offline serviceworkers https://github.com/microsoft/playwright/issues/2311
// test('Offline means offline', async (t, page, context) => {
//     await page.goto('http://localhost:5000/fetch/prefetch')
//     await page.waitForSelector('"Just installed"')
//     await context.setOffline(true)
//     await page.click('"goto/fetch/prefetch/delay0"')
//     await new Promise(resolve => setTimeout(resolve, 1000))
//     const element = await page.$(`.result`)
//     const txt = await element.innerText()
//     await t.deepEqual(txt, '')
// })


test('fresh cache is gone after specified cache timeout', async (t, page, context) => {
    await page.goto('http://localhost:5000/fetch/prefetch/custom-referrer')
    await page.waitForSelector('"Just installed"')
    await fillWithJSON(page.$('#options'), { "headers": { "x-routify-valid-for": 1, "x-routify-write-headers": true } })
    await fillWithJSON(page.$('#prefetch-options'), { "headers": { "validFor": 1 } })

    await page.click('#goto')
    await t.assert(await page.waitForSelector('#result_date'))
    await page.reload({ waitUntil: 'networkidle' })
    await t.assert(await page.$('#header_x-routify-write-headers'))
    await new Promise(resolve => setTimeout(resolve, 1200))
    await page.reload({ waitUntil: 'networkidle' })
    await t.falsy(await page.$('#header_x-routify-write-headers'))
})

// todo wait for Playwright to show correct referrer https://github.com/microsoft/playwright/issues/2415
// test('prefetch can set cache timeout', async (t, page, context) => {
//     await page.goto('http://localhost:5000/fetch/prefetch/custom-referrer')
//     await page.waitForSelector('"Just installed"')
//     await fillWithJSON(page.$('#options'), { "headers": { "x-routify-write-headers": true } })
//     await fillWithJSON(page.$('#prefetch-options'), { "headers": { "validFor": 1 } })


//     await page.click('#prefetch')
//     await new Promise(resolve => setTimeout(resolve, 2000))
//     await page.click('#goto')
//     await t.assert(await page.$('#header_x-routify-write-headers'))
//     await new Promise(resolve => setTimeout(resolve, 12000))
//     await page.reload({ waitUntil: 'networkidle' })
//     await t.falsy(await page.$('#header_x-routify-write-headers'))
// })




async function fillWithJSON(elem, json) {
    return await elem.then(elem =>
        elem.fill(JSON.stringify(json)))
}