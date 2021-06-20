import { RoutifyRuntime } from '#lib/runtime/Instance/RoutifyRuntime.js'
import '../../../typedef.js'

import { Routify } from '../Routify'
import { mockRoutes } from '../utils'

test('mock routes', () => {
    const instance = new Routify({})
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
