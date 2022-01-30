import { Router } from '../../../runtime/Router/Router.js'
import { RoutifyRuntime } from '../../../runtime/Instance/RoutifyRuntime.js'
import { Route } from '../Route.js'

const exported = {
    meta: {},
    module: () => '_default',
    name: '',
    rootName: 'default',
    children: [
        {
            meta: { reset: true },
            module: () => '_default_admin',
            name: 'admin',
            children: [],
        },
        {
            module: () => '_default__falback',
            name: '_fallback',
            meta: { fallback: true },
            children: [],
        },
        {
            module: () => '_default_blog',
            name: 'blog',
            children: [
                {
                    module: () => '_default_blog_latest',
                    name: 'latest',
                    children: [],
                },
                {
                    module: () => '_default_blog_[slug]',
                    name: '[slug]',
                    children: [
                        {
                            module: () => '_default_blog_[slug]_index',
                            name: 'index',
                            children: [],
                        },
                    ],
                },
            ],
        },
    ],
}

const router = new Router({ routes: exported })

test('creates correct fragments for a route', () => {
    const route = new Route(router, '/admin', 'pushState')

    expect(route.fragments.map(f => f.node.name)).toEqual(['', 'admin'])
})

test('creates correct fragments for a nested route', () => {
    const route = new Route(router, '/blog/latest', 'pushState')
    expect(route.fragments.map(f => f.node.name)).toEqual(['', 'blog', 'latest'])
})

test('creates correct fragments for a missing route with fallback', () => {
    const route = new Route(router, '/admin/oops', 'pushState')

    expect(route.fragments.map(f => f.node.name)).toEqual(['', 'admin', '_fallback'])
})

test('creates correct params', () => {
    const route = new Route(router, '/blog/my-story', 'pushState')
    expect(route.params).toEqual({ slug: 'my-story' })
})

test('params are reactive', async () => {
    let value = {}

    const unsub = router.activeRoute.subscribe(route => (value = route?.params))

    await router.url.push('/blog/my-story')
    expect(value).toEqual({ slug: 'my-story' })

    await router.url.push('/blog/my-story-2')
    expect(value).toEqual({ slug: 'my-story-2' })
    unsub()

    await router.url.push('/blog/my-story-3')
    expect(value).toEqual({ slug: 'my-story-2' })
})
