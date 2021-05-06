import { Routify } from '../../../lib/common/Routify.js'
import '../../../lib/../typedef.js'

const instance = new Routify({})
const node = instance.createNode('my-node')

test('can create node', async () => {
    expect(node.name).toBe('my-node')
})

test('can appendChild', async () => {
    const child = instance.createNode('appended-child')
    node.appendChild(child)
    expect(node.children[0].name).toBe('appended-child')
})

test('can createChild', async () => {
    node.createChild('created-child')
    expect(node.children[1].name).toBe('created-child')
})
