import '../../../typedef.js'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Meta } from '../Meta.js'

const testInheritance = suite('meta inheritance')

const node0 = {}
node0.meta = new Meta(node0)
const node1 = { parent: node0 }
node1.meta = new Meta(node1)
const node2 = { parent: node1 }
node2.meta = new Meta(node2)

testInheritance('can set meta', () => {
    node0.meta.hello = 'normal'
    node0.meta.greeter = name => `hello ${name}`
    assert.is(node0.meta.hello, 'normal')
})

testInheritance('child cannot read parents normal meta', () => {
    assert.not(node1.meta.hello)
})

testInheritance('can set scoped meta', () => {
    node0.meta['scopedHello|scoped'] = 'scoped'
    assert.is(
        node0.meta.scopedHello,
        'scoped',
        'should be able to access own scoped meta',
    )
    assert.is(
        node1.meta.scopedHello,
        'scoped',
        'should be able to access parents scoped meta',
    )
    assert.is(
        node2.meta.scopedHello,
        'scoped',
        'should be able to access grandparents scoped meta',
    )
})

testInheritance('directives are removed from meta key ', () => {
    assert.not(node0.meta['scopedHello|scoped'], 'scoped')
})

const testJson = suite('meta toJSON')

testJson('can export functions to json with __EVAL::', () => {
    const json = JSON.parse(JSON.stringify(node0.meta))

    assert.equal(json, {
        hello: 'normal',
        greeter: 'name => `hello ${name}`::_EVAL',
        'scopedHello|scoped': 'scoped',
    })
})

testInheritance.run()
testJson.run()
