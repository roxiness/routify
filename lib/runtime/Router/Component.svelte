<script>
    import { writable } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeMulti } from './utils/index.js'

    // TODO ditch fragments prop; rename parentContext to context and use for fragments?

    /** @type {RouteFragment[]}*/
    export let fragments = []
    export let options = {}
    /** @type {import('./types').RenderContext}*/
    export let parentContext = null

    const single = writable(true)
    const { multi, decorator, props } = options
    const router = fragments[0]?.route.router || parentContext.router

    /** @type {import('./utils/index').Multi}*/
    const setup = normalizeMulti(multi, fragments[0]?.node, parentContext)

    /** @type {import('./types').RenderContext[] }*/
    const childContexts = setup.pages.map(node => ({
        restFragments: writable([]),
        node,
        fragment: new RouteFragment(null, node, null, {}),
        isActive: writable(false),
        router,
        route: null,
        parentContext,
        decorators: [parentContext?.decorators, decorator].flat().filter(Boolean),
        single,
    }))

    $: single.set(setup.single)

    /**
     *
     * @param {RouteFragment[]} fragments
     */
    const handlePageChange = fragments => {
        if (!fragments.length) {
            console.log('no fragments. Parent context is', parentContext)
            return
        }
        const [fragment, ...restFragments] = [...fragments]
        // console.log('page changed', fragment, restFragments)
        // todo we should match node, not node.id. For some reason node instances are different
        const activeContext = childContexts.find(s => s.node.id === fragment?.node.id)
        if (!activeContext) {
            console.error('pool', childContexts)
            console.error('fragments', fragments)
            throw new Error(`couldn't find context for ${fragment?.node.id}`)
        }

        activeContext.fragment = fragment
        activeContext.restFragments.set(restFragments)
        activeContext.route = fragments[0].route
        console.log('setRoute', activeContext, fragments[0].route)
        // todo issue is caused by routify:meta reset in modules/index.md

        // set this sibling to active and all other to inactive
        childContexts.forEach(s =>
            s.isActive.set(
                s === activeContext &&
                    activeContext?.route.allFragments.includes(s.fragment),
            ),
        )
    }

    $: fragments.length && handlePageChange(fragments)
</script>

{#each childContexts as context (context.node.id)}
    <RenderFragment {context} {props} />
{/each}
