<script>
    import { createSequenceHooksCollection } from 'hookar'

    import { writable } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeMulti } from './utils/normalizeMulti.js'

    /** @type {import('./types').RenderContext}*/
    export let context = null
    export let options = {}

    const { childFragments, isActive } = context
    const { multi, decorator, props } = options
    let activeContext

    /** @returns {import('./types').RenderContext[] }*/
    const buildChildContexts = () => {
        /** @type {import('./utils/index').Multi}*/
        const setup = normalizeMulti(multi, $childFragments[0]?.node, context)

        return setup.pages.map(node => ({
            childFragments: writable([]),
            node,
            fragment: new RouteFragment(null, node, null, {}),
            isActive: writable(false),
            router: $childFragments[0]?.route.router || context.router,
            route: null,
            parentContext: context,
            onDestroy: createSequenceHooksCollection(),
            decorators: [context?.decorators, decorator].flat().filter(Boolean),
            single: writable(setup.single),
        }))
    }

    let childContexts = buildChildContexts()

    // if parent changes status to inactive, so does children
    $: if (isActive && !$isActive) childContexts.forEach(cc => cc.isActive.set(false))

    /**
     * @param {RouteFragment[]} fragments
     */
    const handlePageChange = fragments => {
        const [fragment, ...childFragments] = [...fragments]
        // todo we should match node, not node.id. For some reason node instances are different
        activeContext = childContexts.find(s => s.node.id === fragment?.node.id)
        if (!activeContext) {
            // if we're rendering a node that didn't exist at this level before, we need to rebuild the child contexts
            // this happens when navigating in or out of a reset module
            childContexts = buildChildContexts()
            return handlePageChange(fragments)
        }

        activeContext.fragment = fragment
        activeContext.childFragments.set(childFragments)
        activeContext.route = fragments[0].route
        // todo issue is caused by routify:meta reset in modules/index.md

        // set this sibling to active and all other to inactive
        childContexts.forEach(s => s.isActive.set(s === activeContext))
    }

    $: $childFragments.length && handlePageChange($childFragments)
</script>

{#each childContexts as context (context.node.id)}
    <RenderFragment {context} {props} {activeContext} />
{/each}
