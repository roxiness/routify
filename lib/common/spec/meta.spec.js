import { Meta } from '../Meta.js'

const node0 = {}
// @ts-ignore
node0.meta = new Meta(node0)
const node1 = { parent: node0 }
// @ts-ignore
node1.meta = new Meta(node1)
const node2 = { parent: node1 }
// @ts-ignore
node2.meta = new Meta(node2)

describe('inline meta specs', () => {
    test('can set meta', () => {
        node0.meta.hello = 'normal'
        node0.meta.greeter = name => `hello ${name}`
        expect(node0.meta.hello).toBe('normal')
    })

    test('child cannot read parents normal meta', () => {
        expect(node1.meta.hello).toBeFalsy()
    })

    test('can set scoped meta', () => {
        node0.meta['scopedHello|scoped'] = 'scoped'
        expect(node0.meta.scopedHello).toBe('scoped') //should be able to access own scoped meta
        expect(node1.meta.scopedHello).toBe('scoped') //should be able to access parents scoped meta
        // expect(node2.meta.scopedHello).toBe('scoped') //should be able to access grandparents scoped meta
    })

    test('can list properties', () => {
        // todo
        // console.log(node0.meta)
        // console.log({ ...node0.meta })
    })
})

describe('object meta specs', () => {
    test('can set meta', () => {
        node0.meta.hello = { value: 'normal' }
        node0.meta.greeter = { value: name => `hello ${name}` }
        expect(node0.meta.hello).toBe('normal')
    })

    test('child cannot read parents normal meta', () => {
        expect(node1.meta.hello).toBeFalsy()
    })

    test('can set scoped meta', () => {
        node0.meta['scopedHello|scoped'] = 'scoped'
        expect(node0.meta.scopedHello).toBe('scoped') //should be able to access own scoped meta
        expect(node1.meta.scopedHello).toBe('scoped') //should be able to access parents scoped meta
        expect(node2.meta.scopedHello).toBe('scoped') //should be able to access grandparents scoped meta
    })
})

test('can set scoped meta with object', () => {
    node0.meta['scopedHello|scoped'] = 'scoped'
    expect(node0.meta.scopedHello).toBe('scoped') //should be able to access own scoped meta
    expect(node1.meta.scopedHello).toBe('scoped') //should be able to access parents scoped meta
    expect(node2.meta.scopedHello).toBe('scoped') //should be able to access grandparents scoped meta
})

test('directives are removed from meta key ', () => {
    expect(node0.meta['scopedHello|scoped']).toBeFalsy()
})
