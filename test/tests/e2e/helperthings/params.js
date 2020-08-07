const test = require('../../../playwright-test')

test('fixed parameters', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/params/foo/bar/baz');
    t.assert(await page.$('"nested-foo"'))
    t.assert(await page.$('"nested2-bar"'))
    t.assert(await page.$('"nested3-baz"'))    
});

test('overloaded parameters', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/params');
    await page.click('"overload"')
    t.is(page.url(), 'http://localhost:5000/helpers/params?overloaded=yes')
    await page.click('"no overload"')
    t.is(page.url(), 'http://localhost:5000/helpers/params')
});

//todo test that outgoing/destroyed components don't fire