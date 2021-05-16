import { Router } from '#lib/runtime/Router/Router.js'
import { RoutifyRuntime } from '#lib/runtime/Instance/RoutifyRuntime.js'
import { Route } from '../Route.js'

const exported = {
    meta: {},
    component: '_default',
    children: [
        {
            meta: { reset: true },
            component: '_default_admin',
            name: 'admin',
            children: [],
        },
        {
            component: '_default__falback',
            name: '_fallback',
            meta: { fallback: true },
            children: [],
        },
        {
            component: '_default_blog',
            name: 'blog',
            children: [
                {
                    component: '_default_blog_latest',
                    name: 'latest',
                    children: [],
                },
                {
                    component: '_default_blog_[slug]',
                    name: '[slug]',
                    children: [
                        {
                            component: '_default_blog_[slug]_index',
                            name: 'index',
                            children: [],
                        },
                    ],
                },
            ],
        },
    ],
}

const instance = new RoutifyRuntime({ routes: exported })
const router = new Router(instance)

test('creates correct fragments for a route', () => {
    const urlObj = { url: '/admin' }
    const route = new Route(router, urlObj)

    expect(route.fragments.map(f => f.node.name)).toEqual(['', 'admin'])
})

test('creates correct fragments for a nested route', () => {
    const urlObj = { url: '/blog/latest' }
    const route = new Route(router, urlObj)

    expect(route.fragments.map(f => f.node.name)).toEqual([
        '',
        'blog',
        'latest',
    ])
})

test('creates correct fragments for a missing route with fallback', () => {
    const urlObj = { url: '/admin/oops' }
    const route = new Route(router, urlObj)

    expect(route.fragments.map(f => f.node.name)).toEqual([
        '',
        'admin',
        '_fallback',
    ])
})

test('creates correct params', () => {
    const urlObj = { url: '/blog/my-story' }
    const route = new Route(router, urlObj)
    expect(route.params).toEqual({ slug: 'my-story' })
})

test('params are reactive', async () => {
    let value = {}
    const unsub = router.params.subscribe(val => (value = val))
    router.activeUrl.push('/blog/my-story')
    expect(value).toEqual({ slug: 'my-story' })
    router.activeUrl.push('/blog/my-story-2')
    expect(value).toEqual({ slug: 'my-story-2' })
    unsub()
    router.activeUrl.push('/blog/my-story-3')
    expect(value).toEqual({ slug: 'my-story-2' })
})
