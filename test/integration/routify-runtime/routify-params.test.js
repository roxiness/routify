import { get } from 'svelte/store'
import { Router } from '../../../lib/runtime/Router.js'
import { RoutifyRuntime } from '../../../lib/runtime/RoutifyRuntime.js'

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
            component: '_default_blog',
            name: 'blog',
            children: [
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

router.activeUrl.push('/blog/my-story', 'internal')

test('activeRoute.fragments show currently active nodes', () => {
    expect(
        get(router.activeRoute).fragments.map(apn => [
            apn.node.name,
            apn.urlFragment,
        ]),
    ).toEqual([
        ['', ''],
        ['blog', 'blog'],
        ['[slug]', 'my-story'],
        ['index', ''],
    ])
})

test('can get params', async () => {
    router.activeUrl.push('/blog/my-story', 'internal')
    expect(get(router.params)).toEqual({ slug: 'my-story' })
})

test('params are reactive', async () => {
    let value = {}
    const unsub = router.params.subscribe(val => (value = val))
    expect(value).toEqual({ slug: 'my-story' })
    router.activeUrl.push('/blog/my-story-2', 'internal')
    expect(value).toEqual({ slug: 'my-story-2' })
    unsub()
    router.activeUrl.push('/blog/my-story-3', 'internal')
    expect(value).toEqual({ slug: 'my-story-2' })
})
