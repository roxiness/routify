import { RoutifyRuntime } from '../../runtime/Instance/RoutifyRuntime.js'

import { RoutifyBuildtime } from '../../buildtime/RoutifyBuildtime'
import { mockRoutes } from '../utils'

test('mock routes', () => {
    const instance = new RoutifyBuildtime({})
    mockRoutes(instance, {
        index: {
            about: {},
            posts: { '[slug]': {} },
            admin: { crud: {}, users: {} },
        },
    })
    expect(instance.superNode.children[0].name).toBe('index')
    expect(instance.superNode.children[0].children[0].name).toBe('about')
})

test('mock runtime routes', () => {
    const instance = new RoutifyRuntime({})
    mockRoutes(instance, {
        index: {
            about: {},
            posts: { '[slug]': {} },
            admin: { crud: {}, users: {} },
        },
    })
    const index = instance.superNode.children[0]
    expect(index.name).toBe('index')
    expect(index.children.about.name).toBe('about')
    expect(index.children.posts.children['[slug]'].name).toBe('[slug]')
})

// test('resolveValues', () => {
//     const obj = {
//         plan: { text: 'nothing to see here' },
//         nested: { nested2: { text: 'nor here' } },
//         value: { value: { text: 'resolve me' } },
//         nestedValue: { nested2: { value: { text: 'resolve me too' } } },
//     }
//     const newObj = resolveValues(obj)
//     expect(newObj).not.toEqual(obj)
//     expect(newObj).toEqual({
//         plan: { text: 'nothing to see here' },
//         nested: { nested2: { text: 'nor here' } },
//         value: { text: 'resolve me' },
//         nestedValue: { nested2: { text: 'resolve me too' } },
//     })
// })
