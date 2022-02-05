import { RNodeBuildtime } from '../../../lib/buildtime/RNodeBuildtime'
import { RoutifyBuildtime } from '../../../lib/buildtime/RoutifyBuildtime'

/** @type {RoutifyBuildtime} */
let instance
/** @type {RNodeBuildtime} */
let rootNode

test('new instance has one empty super node', () => {
    instance = new RoutifyBuildtime({})
    expect(instance.nodeIndex.length).toBe(0)
})

// test('super node has no descendants', () => {
//     expect(instance.superNode.descendants.length).toBe(0)
// })

test('can create node', () => {
    rootNode = instance.createNode('firstRoot')
    expect(rootNode.name).toBe('firstRoot')
})

test('new node is in nodeIndex', () => {
    expect(instance.nodeIndex.length).toBe(1)
    expect(instance.nodeIndex[0]).toBe(rootNode)
})

// todo readd?
// test("rootNodes' children do not bleed over", () => {
//     const rootNode2 = instance.createNode('rootNode2')
//     instance.superNode.appendChild(rootNode2)
//     const childNode = instance.createNode('childNode')
//     Object.values(instance.rootNodes)[0].appendChild(childNode)

//     expect(instance.nodeIndex.length).toBe(4)
//     expect(rootNode.children[0]).toBe(childNode)
//     expect(rootNode2.children.length).toBe(0)
// })
