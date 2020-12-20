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

test('component reloads when param-is-page=true', async(t, page) => {
    await page.goto('http://localhost:5000/helpers/params/is-page/foo');
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 1"'))
    await page.click('"Bar"')
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 1"'))
    await page.click('"Bar"')
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 1"'))
    await page.click('"overload it"')
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 2"'))
})

test('component reloads when query-params-is-page=true', async(t, page) => {
    await page.goto('http://localhost:5000/helpers/params/query-is-page/foo');
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 1"'))
    await page.click('"overload static"')
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 1"'))
    await page.click('"overload static"')
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 1"'))
})

test('component doesn\' reload if param-is-page and query-params-is-page is missing', async(t, page) => {
    await page.goto('http://localhost:5000/helpers/params/is-not-page/foo');
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 1"'))
    await page.click('"Bar"')
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 2"'))
    await page.click('"overload it"')
    t.assert(await page.$('"[is-page.svelte] afterPageLoad count: 3"'))
})


//todo test that outgoing/destroyed components don't fire