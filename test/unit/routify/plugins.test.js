import { RoutifyRuntime } from '../../../lib/runtime/RoutifyRuntime.js'
import '../../../lib/../typedef.js'

/**
 * @type {RoutifyPlugin}
 */
const aPlugin = {
    mode: 'runtime',
    run: ({ instance }) => {
        const node = instance.createNode('my-node')
        instance.superNode.appendChild(node)
    },
}
/**
 * @type {RoutifyPlugin}
 */
const anotherPlugin = {
    mode: 'runtime',
    run: ({ instance }) => {
        const node = instance.createNode('my-2nd-node')
        instance.superNode.appendChild(node)
    },
}

test('can run plugin', async () => {
    const instance = new RoutifyRuntime({
        plugins: [aPlugin],
    })
    await instance.start()
    expect(instance.superNode.descendants[0]).toBeTruthy()
    expect(instance.superNode.descendants[0].name).toBe('my-node')
})

test('can run multiple plugins', async () => {
    const instance = new RoutifyRuntime({
        plugins: [aPlugin, anotherPlugin],
    })
    await instance.start()
    expect(instance.superNode.descendants[0].name).toBe('my-node')
    expect(instance.superNode.descendants[1].name).toBe('my-2nd-node')
})
