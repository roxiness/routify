const test = require('../../playwright-test')

test('parameters work', async (t, page) => {
    await page.goto('http://localhost:5000/helpers/params/foo/bar/baz');
    t.assert(await page.$('"nested-foo"'))
    t.assert(await page.$('"nested2-bar"'))
    t.assert(await page.$('"nested3-baz"'))    
});

//todo test that outgoing/destroyed components don't fire