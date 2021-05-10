import { Router } from '#lib/runtime/Router.js'
import { RoutifyRuntime } from '#lib/runtime/RoutifyRuntime.js'
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
// // todo move params tests here
// // todo test fallback
