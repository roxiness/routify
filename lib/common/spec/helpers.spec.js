import { findNearestParent } from '../helpers.js'

const treeGrandChild = {
    name: 'grand child',
    parent: {
        name: 'child',
        parent: {
            name: 'me',
            parent: {
                name: 'parent',
                parent: {
                    name: 'grand parent',
                },
            },
        },
    },
}
const treeChild = treeGrandChild.parent
const treeMe = treeGrandChild.parent.parent
const treeParent = treeGrandChild.parent.parent.parent
const treeGrandParent = treeGrandChild.parent.parent.parent.parent

test('findNearestParent can return parent', async () => {
    const child = findNearestParent(treeGrandChild, node => node.name === 'child')
    expect(child).toEqual(treeChild)
})

test('findNearestParent can return grand parent', async () => {
    const me = findNearestParent(treeGrandChild, node => node.name === 'me')
    expect(me).toEqual(treeMe)
})
