import { mockRoutes } from '../../../common/utils.js'
import { RoutifyRuntime } from '../../../runtime/Instance/RoutifyRuntime.js'
import { traverseNode, getPath, getMRCA } from '../index.js'

const instance = new RoutifyRuntime({})
instance.rootNodes.default = mockRoutes(instance, {
    module: {
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

const moduleNode = Object.values(instance.rootNodes)[0]
const slugNode = instance.nodeIndex.find(node => node.name === '[slug]')
const crudNode = instance.nodeIndex.find(node => node.name === 'crud')
const adminNode = instance.nodeIndex.find(node => node.name === 'admin')

test('can resolve parent', () => {
    const parent = traverseNode(crudNode, '..')
    expect(parent.name).toBe('admin')
})

test('can resolve grandparent', () => {
    const grandparent = traverseNode(crudNode, '../..')
    expect(grandparent.name).toBe('module')
})

test('can resolve sibling', () => {
    const res = traverseNode(crudNode, '../users')
    expect(res.name).toBe('users')
})

test('can find mrca', () => {
    const mrcaNode = getMRCA(slugNode, crudNode)
    expect(mrcaNode).toBe(moduleNode)
})

test('can find self as mrca', () => {
    const mrcaNode = getMRCA(crudNode, adminNode)
    expect(mrcaNode).toBe(adminNode)
})

test('can find self as mrca reversed', () => {
    const mrcaNode = getMRCA(adminNode, crudNode)
    expect(mrcaNode).toBe(adminNode)
})

test('can get path backwards', () => {
    const path = '../'
    const _path = getPath(crudNode, adminNode)
    expect(_path).toBe(path)
})

test('can get path forward', () => {
    const path = 'crud'
    const _path = getPath(adminNode, crudNode)
    expect(_path).toBe(path)
})

test('can get path back and forward', () => {
    const path = '../../admin/crud'
    const _path = getPath(slugNode, crudNode)
    expect(_path).toBe(path)
})

test('traverseNode can be reversed with getPath', () => {
    const path = getPath(slugNode, crudNode)
    expect(traverseNode(slugNode, path)).toBe(crudNode)
})
