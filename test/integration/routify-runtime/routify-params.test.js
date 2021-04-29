import { get } from 'svelte/store'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Router } from '../../../lib/runtime/Router.js'
import { RoutifyRuntime } from '../../../lib/runtime/RoutifyRuntime.js'

const test = suite('routify')

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

router.activeUrl.set('/blog/my-story')

test('activeRoute.fragments show currently active nodes', () => {
    assert.equal(
        get(router.activeRoute).fragments.map(apn => [
            apn.node.name,
            apn.urlFragment,
        ]),
        [
            ['', ''],
            ['blog', 'blog'],
            ['[slug]', 'my-story'],
            ['index', ''],
        ],
    )
})

test('can get params', async () => {
    router.activeUrl.set('/blog/my-story')
    assert.equal(get(router.params), { slug: 'my-story' })
})

test('params are reactive', async () => {
    let value = {}
    const unsub = router.params.subscribe(val => (value = val))
    assert.equal(value, { slug: 'my-story' })
    router.activeUrl.set('/blog/my-story-2')
    assert.equal(value, { slug: 'my-story-2' })
    unsub()
    router.activeUrl.set('/blog/my-story-3')
    assert.equal(value, { slug: 'my-story-2' })
})

test.run()
