import { Router } from '../../../Router/Router.js'
import { Route } from '../../../Route/Route.js'

const exported = {
    meta: {},
    module: () => '_default',
    name: '',
    rootName: 'default',
    children: [
        {
            meta: { moduleName: 'wide' },
            id: '_default__module_wide_svelte',
            name: '_module-wide',
            children: [],
        },
        {
            module: () => '_default_blog',
            name: 'blog',
            children: [
                {
                    meta: { reset: 'wide' },
                    id: '_default_blog_fullscreen_wide_svelte',
                    name: 'fullscreen',
                    children: [],
                },
                {
                    meta: { reset: 'wide+' },
                    id: '_default_blog_prepend-fullscreen_wide____svelte',
                    name: 'prepend-fullscreen',
                    children: [],
                },
                {
                    meta: { reset: true },
                    id: '_default_blog_reset-me____svelte',
                    name: 'reset-me',
                    children: [],
                },
                {
                    meta: { reset: 1 },
                    id: '_default_blog_reset-one____svelte',
                    name: 'reset-one',
                    children: [],
                },
                {
                    meta: {},
                    id: '_default_blog_regular_svelte',
                    name: 'regular',
                    children: [],
                },
            ],
        },
    ],
}

const router = new Router({ routes: exported })

test('regular route has normal module', async () => {
    const route = new Route(router, '/blog/regular', 'pushState')
    await route.runBeforeUrlChangeHooks()
    expect(route.fragments.map(f => f.node.name)).toEqual(['', 'blog', 'regular'])
})

test('reset route has no module', async () => {
    const route = new Route(router, '/blog/reset-me', 'pushState')
    await route.runBeforeUrlChangeHooks()
    expect(route.fragments.map(f => f.node.name)).toEqual(['reset-me'])
})

test('reset with number route has x modules', async () => {
    const route = new Route(router, '/blog/reset-one', 'pushState')
    await route.runBeforeUrlChangeHooks()
    expect(route.fragments.map(f => f.node.name)).toEqual(['', 'reset-one'])
})

test('string reset route has only requested module', async () => {
    const route = new Route(router, '/blog/fullscreen', 'pushState')
    await route.runBeforeUrlChangeHooks()
    expect(route.fragments.map(f => f.node.name)).toEqual(['_module-wide', 'fullscreen'])
})

test('string reset with prepend prepends module', async () => {
    const route = new Route(router, '/blog/prepend-fullscreen', 'pushState')
    await route.runBeforeUrlChangeHooks()
    expect(route.fragments.map(f => f.node.name)).toEqual([
        '_module-wide',
        '',
        'blog',
        'prepend-fullscreen',
    ])
})
