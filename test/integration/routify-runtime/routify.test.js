import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { RoutifyRuntime } from '../../../runtime/RoutifyRuntime.js'
const test = suite('routify')

test('RoutifyRuntimes supernode uses RNodeRuntime', async () => {
    const instance = new RoutifyRuntime({})
    const child = instance.superNode.createChild('test')
    assert.is(child.constructor.name, 'RNodeRuntime')
})

test('RoutifyRuntimes uses RNodeRuntime', async () => {
    const instance = new RoutifyRuntime({})
    const child = instance.createNode('test')
    assert.is(child.constructor.name, 'RNodeRuntime')
})

test('RNodeRuntime has regex prop', async () => {
    const instance = new RoutifyRuntime({})
    const child = instance.createNode('test')
    assert.ok(child.regex)
})

test.run()
