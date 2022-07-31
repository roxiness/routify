import { RoutifyRuntime } from '../../runtime/Instance/RoutifyRuntime.js'

import { RoutifyBuildtime } from '../../buildtime/RoutifyBuildtime.js'
import { mockRoutes, next } from '../utils.js'
import { writable } from 'svelte/store'

test('mock routes', () => {
    const instance = new RoutifyBuildtime({})
    instance.rootNodes.default = mockRoutes(instance, {
        module: {
            about: {},
            posts: { '[slug]': {} },
            admin: { crud: {}, users: {} },
        },
    })
    expect(instance.rootNodes.default.name).toBe('module')
    expect(instance.rootNodes.default.children[0].name).toBe('about')
})

test('mock runtime routes', () => {
    const instance = new RoutifyRuntime({})
    instance.rootNodes.default = mockRoutes(instance, {
        module: {
            about: {},
            posts: { '[slug]': {} },
            admin: { crud: {}, users: {} },
        },
    })
    const module = instance.rootNodes.default
    expect(module.name).toBe('module')
    expect(module.traverse('./posts').name).toBe('posts')
    expect(module.traverse('./about').name).toBe('about')
    expect(module.traverse('./posts/[slug]').name).toBe('[slug]')
})

test('next store value', () => {
    test('next with any', async () => {
        const events = []
        const store = writable('foo')
        const promise = next(store).then(value => events.push(value))
        store.set('bar')
        await promise
        assert.deepEqual(events, ['bar'])
    })
    test('next with specific', async () => {
        const events = []
        const store = writable('foo')
        const promise = next(store, 'i-want-this').then(value => events.push(value))
        store.set('ignore-me')
        store.set('and-me')
        store.set('i-want-this')
        await promise
        assert.deepEqual(events, ['i-want-this'])
    })
    test('next with callback', async () => {
        const events = []
        const store = writable('foo')
        const promise = next(store, val => val === 'i-want-this').then(value =>
            events.push(value),
        )
        store.set('ignore-me')
        store.set('and-me')
        store.set('i-want-this')
        await promise
        assert.deepEqual(events, ['i-want-this'])
    })
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
