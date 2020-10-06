const test = require('../../../playwright-test')

test('urls resolve correctly', async (t, page) => {
    let counter = 0
    const expectations = {
        none: '/helpers/url',
        plain: '/helpers/path/to',
        withParam: '/helpers/path/:param',
        parent: '/helpers',
        grantParent: '/',
        sibling: '/helpers/sibling',
        named: '/helpers/url',
        unmatchedNamed: 'unmatched-named-path',
    }
    const types = ['prop', 'use', 'prop-param', 'use-param']
    
    await page.goto('http://localhost:5000/helpers/url');
    
    let param = 'init'
    await runTests()

    await page.click("'set param to \"updated\"'")

    param = 'updated'
    await runTests()

    t.is(counter, 8*4*2, 'should text 6 urls in 4 modes with 2 parameters')

    async function runTests(){
        for (const [name, expect] of Object.entries(expectations)) {
            for (const type of types) {
                const elem = await page.$(`.url-${name}-${type}`)
                const href = await elem.evaluate(node => node.getAttribute('href'))
    
                if (['prop', 'use'].includes(type)) {
                    t.is(href, expect, `ran for ${name}, ${expect}`)
                }
                else if (['prop-param', 'use-param'].includes(type)) {
                    if (name === 'withParam') {
                        const _expect = expect.replace(':param', param) + '?foo=foo'
                        t.is(href, _expect, `ran for ${name}, ${expect}`)
                    }
                    else {
                        const _expect = `${expect}?foo=foo&param=${param}`
                        t.is(href, _expect, `ran for ${name}, ${expect}`)
                    }
                }

                counter++
            }
        }    
    }
});


test('hash urls resolve correctly', async (t, page) => {
    let counter = 0
    const expectations = {
        none: '#/helpers/url',
        plain: '#/helpers/path/to',
        withParam: '#/helpers/path/:param',
        parent: '#/helpers',
        grantParent: '#/',
        sibling: '#/helpers/sibling'
    }
    const types = ['prop', 'use', 'prop-param', 'use-param']
    
    await page.goto('http://localhost:5000?useHash=1#/helpers/url');
    
    let param = 'init'
    await runTests()

    await page.click("'set param to \"updated\"'")

    param = 'updated'
    await runTests()

    t.is(counter, 6*4*2, 'should text 6 urls in 4 modes with 2 parameters')

    async function runTests(){
        for (const [name, expect] of Object.entries(expectations)) {
            for (const type of types) {
                const elem = await page.$(`.url-${name}-${type}`)
                const href = await elem.evaluate(node => node.getAttribute('href'))
    
                if (['prop', 'use'].includes(type)) {
                    t.is(href, expect, `ran for ${name}, ${expect}`)
                }
                else if (['prop-param', 'use-param'].includes(type)) {
                    if (name === 'withParam') {
                        const _expect = expect.replace(':param', param) + '?foo=foo'
                        t.is(href, _expect, `ran for ${name}, ${expect}`)
                    }
                    else {
                        const _expect = `${expect}?foo=foo&param=${param}`
                        t.is(href, _expect, `ran for ${name}, ${expect}`)
                    }
                }

                counter++
            }
        }    
    }
});
