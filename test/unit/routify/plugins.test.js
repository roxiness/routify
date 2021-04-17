import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Routify } from '../../../common/Routify.js'
import '../../../typedef.js'

const test = suite('plugins')

/**
 * @type {RoutifyPlugin}
 */
const aPlugin = {
    mode: 'compile',
    run: ({ instance }) => {
        const node = instance.createNode('my-node')
        instance.superNode.appendChild(node)
    },
}
/**
 * @type {RoutifyPlugin}
 */
const anotherPlugin = {
    mode: 'compile',
    run: ({ instance }) => {
        const node = instance.createNode('my-2nd-node')
        instance.superNode.appendChild(node)
    },
}

test('can run plugin', async () => {
    const instance = new Routify({
        plugins: [aPlugin],
    })
    await instance.start()
    assert.ok(instance.superNode.descendants[0])
    assert.is(instance.superNode.descendants[0].name, 'my-node')
})

test('can run multiple plugins', async () => {
    const instance = new Routify({
        plugins: [aPlugin, anotherPlugin],
    })
    await instance.start()
    assert.is(instance.superNode.descendants[0].name, 'my-node')
    assert.is(instance.superNode.descendants[1].name, 'my-2nd-node')
})

test.run()
