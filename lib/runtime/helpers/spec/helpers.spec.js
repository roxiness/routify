import { mockRoutes } from '#lib/common/utils'
import { RoutifyRuntime } from '#lib/runtime/Instance/RoutifyRuntime'
import { resolveNode, resolveRelativeNode } from '..'

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
    const res = resolveRelativeNode(node, '..')
    expect(res.name).toBe('index')
    expect(res.parent.name).toBe('admin')
})

test('can resolve grandparent', () => {
    const node = instance.nodeIndex.find(node => node.name === 'crud')
    const res = resolveRelativeNode(node, '../..')
    expect(res.name).toBe('index')
    expect(res.parent.name).toBe('index')
})

test('can resolve sibling', () => {
    const node = instance.nodeIndex.find(node => node.name === 'crud')
    const res = resolveRelativeNode(node, '../users')
    expect(res.name).toBe('index')
    expect(res.parent.name).toBe('users')
})
