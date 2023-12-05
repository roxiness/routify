<script>
    import { get } from 'svelte/store'
    import { pushToOrReplace } from '../utils/index.js'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeDecorator } from './utils/normalizeDecorator.js'
    import { handleRebuildError } from '../utils/messages.js'
    import { addFolderDecorator, findActiveChildContext } from './composeFragments.js'

    /** @type {RenderContext|RouterContext}*/
    export let context

    /** @type {RenderContextOptions} */
    export let options

    const { childFragments } = context
    const { decorator } = options

    const recursiveDecorators = context.decorators.filter(deco => deco.recursive)
    const newDecorators = pushToOrReplace(recursiveDecorators, decorator)
        .filter(Boolean)
        .map(normalizeDecorator)

    // addFolderDecorator returns void if decorator is sync, otherwise it returns a promise
    let decoratorReady = !addFolderDecorator(newDecorators, context)?.['then'](
        () => (decoratorReady = true),
    )

    context.buildChildContexts(options, newDecorators)

    const { childContexts } = context

    const _handleChildren = childFragments => {
        context.router.log.verbose('handle children', childFragments) // ROUTIFY-DEV-ONLY
        const setInactive = cf => cf.renderContext.then(rc => rc.isActive.set(false))

        if (childFragments.length && context.route) setActiveChildContext(context)
        // if we're traversing down the tree, we need to set all old child fragments to inactive
        else childFragments.forEach(setInactive)

        context.updateChildren()
    }
    const setActiveChildContext = (context, rebuild) => {
        const [fragment, ...childFragments] = get(context.childFragments)
        const childContexts = get(context.childContexts)

        const toBeActiveChildContext = findActiveChildContext(childContexts, fragment)

        if (!toBeActiveChildContext) {
            if (rebuild) handleRebuildError(context, childContexts)

            // if we're rendering a node that didn't exist at this level before, we need to rebuild the child contexts
            // this happens when navigating in or out of a reset module

            context.buildChildContexts(options, newDecorators)

            return setActiveChildContext(context, true)
        }

        toBeActiveChildContext.setToActive()

        context.childContexts.set(childContexts)
    }

    $: _handleChildren($childFragments)
</script>

{#if decoratorReady}
    {#each $childContexts as context (context)}
        <RenderFragment {context} />
    {/each}
{/if}
