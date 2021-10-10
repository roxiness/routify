import { RoutifyRuntime } from '../../../lib/runtime/Instance/RoutifyRuntime.js'

test('RoutifyRuntimes uses RNodeRuntime', async () => {
    const instance = new RoutifyRuntime({})
    const child = instance.createNode('test')
    expect(child.constructor.name).toBe('RNodeRuntime')
})

test('RNodeRuntime has regex prop', async () => {
    const instance = new RoutifyRuntime({})
    const child = instance.createNode('test')
    expect(child.regex).toBeTruthy()
})
