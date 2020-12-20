const test = require('../../playwright-test')


test('beforeUrlChange blocks asynchronously', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/beforeUrlChange/page1');
    await page.click('"page2"')

    await new Promise(resolve => setTimeout(resolve, 800))
    t.is(page.url(), 'http://localhost:5000/helpers/beforeUrlChange/page1')
    await new Promise(resolve => setTimeout(resolve, 400))
    t.is(page.url(), 'http://localhost:5000/helpers/beforeUrlChange/page2')
});

test('updating parameter triggers beforeUrlChange, afterPageLoad and isChangingPage', async (t, page) => {
    await page.goto('http://dev.local:5000/helpers/beforeUrlChange/foo');
    t.assert(await page.$('"beforeUrlChange ran 0"'))
    t.assert(await page.$('"afterPageLoad ran 1"'))
    t.assert(await page.$('"isChanging true,false"'))

    await page.click('"bar"')
    t.assert(await page.$('"beforeUrlChange ran 1"'))
    t.assert(await page.$('"afterPageLoad ran 2"'))
    t.assert(await page.$('"isChanging true,false,true,false"'))
});

test('isChangingPage doesn\'t trigger when beforeUrlChange returns false', async(t, page) => {
    await page.goto('http://dev.local:5000/helpers/beforeUrlChange/foo');
    t.assert(await page.$('"isChanging true,false"'))
    await page.click('"block me"')
    t.assert(await page.$('"isChanging true,false"'))
})