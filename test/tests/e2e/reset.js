const test = require('../../playwright-test')


//todo test that outgoing/destroyed components don't fire

test('reset', async (t, page) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    await page.goto('http://localhost:5000/reload/meta-reload');
    let layoutDate = await page.$eval("#layout-date", el => el.innerText)
    let pageDate = await page.$eval("#page-date", el => el.innerText)

    await page.click('"invalidate page"')
    let layoutDate2 = await page.$eval("#layout-date", el => el.innerText)
    let pageDate2 = await page.$eval("#page-date", el => el.innerText)
    t.is(layoutDate, layoutDate2, 'resetting page shouldn\'t reset parent layout')
    t.not(pageDate, pageDate2, 'page should be reset')
    
    await page.click('"invalidate layout"')
    let layoutDate3 = await page.$eval("#layout-date", el => el.innerText)
    let pageDate3 = await page.$eval("#page-date", el => el.innerText)
    t.not(layoutDate, layoutDate3, 'layout should be reset')
    t.not(pageDate, pageDate3, 'layout reset should also reset page')
})