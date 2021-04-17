import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Routify } from '../../../common/Routify.js'
import '../../../typedef.js'

const test = suite('node')
const instance = new Routify({ })
const node = instance.createNode('my-node')


test('can create node', async () => {
    assert.is(node.name, 'my-node')
})

test('can appendChild', async () => {
    const child = instance.createNode('appended-child')
    node.appendChild(child)
    assert.is(node.children[0].name, 'appended-child')
})

test('can createChild', async () => {
    node.createChild('created-child')
    assert.is(node.children[1].name, 'created-child')
})

test.run()