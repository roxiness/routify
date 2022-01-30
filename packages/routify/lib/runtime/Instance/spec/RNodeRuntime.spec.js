import { RoutifyRuntime } from '../RoutifyRuntime.js'

const instance = new RoutifyRuntime({})
const node = instance.createNode('my-node')
node.createChild('normal')
node.createChild('_underscored')
node.createChild('_fallback')
node.createChild('index')

test('pages should exclude index and underscored files', () => {
    expect(node.pages.length).toBe(1)
    expect(node.pages[0].name).toBe('normal')
})

// test('children.public should return normal children', () => {
//     expect(node.children.public.length).toBe(2)
//     expect(node.children.public[0].name).toBe('normal')
//     expect(node.children.public[1].name).toBe('index')
// })

test('children returns all children', () => {
    expect(node.children.length).toBe(4)
})

test('children.normal returns a child named normal', () => {
    expect(node.traverse('normal').name).toBe('normal')
})

test('children should have keys from array, filters and child nodes', () => {
    expect(Reflect.ownKeys(node.children)).toEqual(['0', '1', '2', '3', 'length'])
})
