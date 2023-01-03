import { normalizeRouterOptions } from './index.js'

const baseOpts = {
    name: '',
    beforeRouterInit: [],
    afterRouterInit: [],
    urlRewrite: [],
    beforeUrlChange: [],
    afterUrlChange: [],
    transformFragments: [],
    onDestroy: [],
}

test('empty options should return base options', () => {
    const opts = normalizeRouterOptions({})
    assert.deepEqual(opts, baseOpts)
})

test('hook props are transformed to arrays', () => {
    const input = { urlRewrite: 'x' }
    //  @ts-ignore
    const opts = normalizeRouterOptions(input)
    assert.deepEqual(opts, { ...baseOpts, urlRewrite: ['x'] })
})

test('plugins are flattened', () => {
    const input = {
        urlRewrite: 'z',
        plugins: [
            { urlRewrite: 'x1', plugins: [{ urlRewrite: 'x2' }] },
            { urlRewrite: 'y1' },
        ],
    }

    //  @ts-ignore
    const opts = normalizeRouterOptions(input)

    assert.deepEqual(opts, {
        ...baseOpts,
        urlRewrite: ['x2', 'x1', 'y1', 'z'],
    })
})
