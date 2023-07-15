<script>
    import { get } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment.js'
    import { pushToOrReplace } from '../utils/index.js'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeDecorator } from './utils/normalizeDecorator.js'
    import { handleRebuildError } from '../utils/messages.js'
    import {
        addFolderDecorator,
        buildChildContexts,
        findActiveChildContext,
        updateVisibility,
    } from './composeFragments.js'

    /** @type {RenderContext}*/
    export let context

    /** @type {RenderContextOptions} */
    export let options

    const { childFragments, isActive } = context
    const { decorator, props } = options

    const recursiveDecorators = context.decorators.filter(deco => deco.recursive)
    const newDecorators = pushToOrReplace(recursiveDecorators, decorator)
        .filter(Boolean)
        .map(normalizeDecorator)

    const folderDecoraterPromise = addFolderDecorator(newDecorators, context)

    context.childContexts.set(buildChildContexts(options, context, newDecorators))

    const { childContexts } = context

    // if parent changes status to inactive, so does children
    $: if (!$isActive) get(context.childContexts).forEach(cc => cc.isActive.set(false))

    $: $childFragments.length && handlePageChange()
    $: updateVisibility(context)

    const handlePageChange = rebuild => {
        const [fragment, ...childFragments] = get(context.childFragments)
        const childContexts = get(context.childContexts)
        const toBeActiveChildContext = findActiveChildContext(childContexts, fragment)

        if (!toBeActiveChildContext) {
            if (rebuild) handleRebuildError(context, childContexts)

            // if we're rendering a node that didn't exist at this level before, we need to rebuild the child contexts
            // this happens when navigating in or out of a reset module
            context.childContexts.set(buildChildContexts(options, context, newDecorators))

            return handlePageChange(true)
        }

        // if we're traversing down the tree, we need to set all old child fragments to inactive
        const setInactive = cf => cf.renderContext.then(rc => rc.isActive.set(false))
        if (!childFragments.length)
            get(toBeActiveChildContext.childFragments).forEach(setInactive)

        toBeActiveChildContext.fragment = fragment
        toBeActiveChildContext.childFragments.set(childFragments)
        toBeActiveChildContext.route = context.route
        fragment.renderContext.resolve(toBeActiveChildContext)

        context.lastActiveChildContext = get(context.activeChildContext)
        context.activeChildContext.set(toBeActiveChildContext)
        context.childContexts.set(childContexts)
        console.log('handle page change context', context.node?.id, context)
    }
</script>

{#await folderDecoraterPromise then}
    {#each $childContexts as context (context)}
        <RenderFragment {context} {props} />
    {/each}
{/await}
