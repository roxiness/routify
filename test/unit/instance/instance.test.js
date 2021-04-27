import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Routify } from '../../../lib/common/Routify.js'

const nodeTest = suite('node')

/** @type {Routify} */
let instance
/** @type {RNode} */
let rootNode

nodeTest('new instance has one empty super node', () => {
    instance = new Routify({})
    assert.is(instance.nodeIndex.length, 1)
    assert.is(instance.nodeIndex[0].name, '_ROOT')
    assert.is(instance.superNode, instance.nodeIndex[0])
})

nodeTest('super node has no descendants', () => {
    assert.is(instance.superNode.descendants.length, 0)
})

nodeTest('can create node', () => {
    rootNode = instance.createNode('firstRoot')
    assert.is(rootNode.name, 'firstRoot')
})

nodeTest('new node is in nodeIndex', () => {
    assert.is(instance.nodeIndex.length, 2)
    assert.is(instance.nodeIndex[1], rootNode)
})

nodeTest('can nest node as a rootNode in superNode', () => {
    instance.superNode.appendChild(rootNode)
    assert.is(instance.superNode.children[0], rootNode)
})

nodeTest('rootNode is descendant of superNode', () => {
    assert.is(instance.superNode.descendants[0], rootNode)
})

nodeTest('superNode nests one descendant and child', () => {
    assert.is(instance.superNode.children.length, 1)
    assert.is(instance.superNode.descendants.length, 1)
})

nodeTest("rootNodes' children do not bleed over", () => {
    const rootNode2 = instance.createNode('rootNode2')
    instance.superNode.appendChild(rootNode2)
    const childNode = instance.createNode('childNode')
    instance.superNode.children[0].appendChild(childNode)

    assert.is(instance.nodeIndex.length, 4)
    assert.is(rootNode.children[0], childNode)
    assert.is(rootNode2.children.length, 0)
})

nodeTest.run()
