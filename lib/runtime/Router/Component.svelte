<script>
    import { createSequenceHooksCollection } from 'hookar'

    import { writable } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeMulti } from './utils/index.js'

    // TODO ditch fragments prop; rename parentContext to context and use for fragments?

    /** @type {RouteFragment[]}*/
    export let fragments = []
    export let options = {}
    /** @type {import('./types').RenderContext}*/
    export let context = null

    const isActive = context?.isActive
    const single = writable(true)
    const { multi, decorator, props } = options
    let activeContext

    /** @type {import('./utils/index').Multi}*/
    const setup = normalizeMulti(multi, fragments[0]?.node, context)

    /** @type {import('./types').RenderContext[] }*/
    const childContexts = setup.pages.map(node => ({
        restFragments: writable([]),
        node,
        fragment: new RouteFragment(null, node, null, {}),
        isActive: writable(false),
        router: fragments[0]?.route.router || context.router,
        route: null,
        parentContext: context,
        onDestroy: createSequenceHooksCollection(),
        decorators: [context?.decorators, decorator].flat().filter(Boolean),
        single,
    }))

    // if parent changes status to inactive, so does children
    $: if (isActive && !$isActive) childContexts.forEach(cc => cc.isActive.set(false))

    $: single.set(setup.single)

    /**
     * @param {RouteFragment[]} fragments
     */
    const handlePageChange = fragments => {
        if (!fragments.length) return

        const [fragment, ...restFragments] = [...fragments]
        // todo we should match node, not node.id. For some reason node instances are different
        activeContext = childContexts.find(s => s.node.id === fragment?.node.id)
        if (!activeContext)
            throw new Error(`couldn't find context for ${fragment?.node.id}`)

        activeContext.fragment = fragment
        activeContext.restFragments.set(restFragments)
        activeContext.route = fragments[0].route
        // todo issue is caused by routify:meta reset in modules/index.md

        // set this sibling to active and all other to inactive
        childContexts.forEach(s => s.isActive.set(s === activeContext))
    }

    $: fragments.length && handlePageChange(fragments)
</script>

{#each childContexts as context (context.node.id)}
    <RenderFragment {context} {props} {activeContext} />
{/each}
