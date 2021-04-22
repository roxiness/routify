import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { populateNodeTreeFromSnapshot } from '../../../plugins/importer/importer.js'
import { RoutifyRuntime } from '../../../runtime/RoutifyRuntime.js'

const test = suite('importer')

const exported = {
    meta: {},
    component: '_default',
    id: '_default',
    rootName: 'default',
    file: { path: 'test/unit/exporter/example/_module.svelte' },
    children: [
        {
            meta: { reset: true },
            component: '_default_admin',
            id: '_default_admin',
            name: 'admin',
            file: { path: 'test/unit/exporter/example/admin/_reset.svelte' },
            children: [],
        },
    ],
}

test('populateNodeTreeFromSnapshot', () => {
    const instance = new RoutifyRuntime({})
    const node = instance.superNode.createChild('ROOT')
    populateNodeTreeFromSnapshot(node, exported)

    assert.is(instance.superNode.children[0].id, '_default')
    assert.is(instance.superNode.children[0].children[0].id, '_default_admin')
})

test('can import', () => {
    const instance = new RoutifyRuntime({ routes: exported })
    assert.is(instance.superNode.children.length, 1)
    assert.is(instance.superNode.children[0].id, '_default')
    assert.is(instance.superNode.children[0].children[0].id, '_default_admin')
})

test('nodes created by instance have correct constructor', () => {
    const instance = new RoutifyRuntime({ routes: exported })
    const child = instance.superNode.createChild('test')
    assert.is(child.constructor.name, 'RNodeRuntime')
})

test('imported nodes have correct constructor', () => {
    const instance = new RoutifyRuntime({ routes: exported })
    assert.is(instance.superNode.children[0].constructor.name, 'RNodeRuntime')
})

test.run()
