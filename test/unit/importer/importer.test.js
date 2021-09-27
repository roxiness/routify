import { importTree } from '../../../lib/runtime/plugins/importer/importer.js'
import { RoutifyRuntime } from '../../../lib/runtime/Instance/RoutifyRuntime.js'

const exported = {
    meta: {
        aString: 'my-string',
    },
    module: '_default',
    id: '_default',
    rootName: 'default',
    file: { path: 'test/unit/exporter/example/_module.svelte' },
    children: [
        {
            meta: { reset: true },
            module: '_default_admin',
            id: '_default_admin',
            name: 'admin',
            file: { path: 'test/unit/exporter/example/admin/_reset.svelte' },
            children: [],
        },
    ],
}

test('importTree', () => {
    const instance = new RoutifyRuntime({})
    importTree(exported, instance.superNode)

    expect(instance.superNode.children[0].id).toBe('_default')
    expect(instance.superNode.children[0].children[0].id).toBe('_default_admin')
})

test('can import', () => {
    const instance = new RoutifyRuntime({ routes: exported })
    expect(instance.superNode.children.length).toBe(1)
    expect(instance.superNode.children[0].id).toBe('_default')
    expect(instance.superNode.children[0].children[0].id).toBe('_default_admin')
})

test('nodes created by instance have correct constructor', () => {
    const instance = new RoutifyRuntime({ routes: exported })
    const child = instance.superNode.createChild('test')
    expect(child.constructor.name).toBe('RNodeRuntime')
})

test('imported nodes have correct constructor', () => {
    const instance = new RoutifyRuntime({ routes: exported })
    expect(instance.superNode.children[0].constructor.name).toBe('RNodeRuntime')
})

test('meta is imported', () => {
    const instance = new RoutifyRuntime({ routes: exported })
    const { meta } = instance.superNode.children[0]
    expect(meta.aString).toEqual(exported.meta.aString)
})
