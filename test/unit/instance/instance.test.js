import { Routify } from '../../../lib/common/Routify.js'

/** @type {Routify} */
let instance
/** @type {RNode} */
let rootNode

test('new instance has one empty super node', () => {
    instance = new Routify({})
    expect(instance.nodeIndex.length).toBe(1)
    expect(instance.nodeIndex[0].name).toBe('_ROOT')
    expect(instance.superNode).toBe(instance.nodeIndex[0])
})

test('super node has no descendants', () => {
    expect(instance.superNode.descendants.length).toBe(0)
})

test('can create node', () => {
    rootNode = instance.createNode('firstRoot')
    expect(rootNode.name).toBe('firstRoot')
})

test('new node is in nodeIndex', () => {
    expect(instance.nodeIndex.length).toBe(2)
    expect(instance.nodeIndex[1]).toBe(rootNode)
})

test('can nest node as a rootNode in superNode', () => {
    instance.superNode.appendChild(rootNode)
    expect(instance.superNode.children[0]).toBe(rootNode)
})

test('rootNode is descendant of superNode', () => {
    expect(instance.superNode.descendants[0]).toBe(rootNode)
})

test('superNode nests one descendant and child', () => {
    expect(instance.superNode.children.length).toBe(1)
    expect(instance.superNode.descendants.length).toBe(1)
})

test("rootNodes' children do not bleed over", () => {
    const rootNode2 = instance.createNode('rootNode2')
    instance.superNode.appendChild(rootNode2)
    const childNode = instance.createNode('childNode')
    instance.superNode.children[0].appendChild(childNode)

    expect(instance.nodeIndex.length).toBe(4)
    expect(rootNode.children[0]).toBe(childNode)
    expect(rootNode2.children.length).toBe(0)
})
