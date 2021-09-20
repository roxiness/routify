import { mockRoutes } from '../../../common/utils'
import { RoutifyRuntime } from '../../../runtime/Instance/RoutifyRuntime'
import { traverseNode } from '..'

const instance = new RoutifyRuntime({})
mockRoutes(instance, {
    index: {
        index: {},
        about: {},
        posts: { '[slug]': {} },
        admin: {
            index: {},
            crud: { index: {} },
            users: { index: {} },
        },
    },
})

test('can resolve parent', () => {
    const node = instance.nodeIndex.find(node => node.name === 'crud')
    const parent = traverseNode(node, '..')
    expect(parent.name).toBe('admin')
})

test('can resolve grandparent', () => {
    const node = instance.nodeIndex.find(node => node.name === 'crud')
    const grandparent = traverseNode(node, '../..')
    expect(grandparent.name).toBe('index')
})

test('can resolve sibling', () => {
    const node = instance.nodeIndex.find(node => node.name === 'crud')
    const res = traverseNode(node, '../users')
    expect(res.name).toBe('users')
})
