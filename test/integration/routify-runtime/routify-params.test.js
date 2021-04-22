import { get } from 'svelte/store'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { RoutifyRuntime } from '../../../runtime/RoutifyRuntime.js'
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
instance.urlStore.set('/blog/my-story')

test('activePathNodes show currently active nodes', () => {
    assert.equal(
        get(instance.activePathNodes).map(apn => [
            apn.node.name,
            apn.pathFragment,
        ]),
        [
            ['', ''],
            ['blog', 'blog'],
            ['[slug]', 'my-story'],
            ['index', ''],
        ],
    )
})

test('can return params', async () => {
    instance.urlStore.set('/blog/my-story')
    assert.equal(get(instance.params), { slug: 'my-story' })
})

test.run()
