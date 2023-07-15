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
    export let context = null

    /** @type {Partial<{inline: InlineInput, decorator:DecoratorInput, props, options, anchor: AnchorLocation, scrollBoundary: scrollBoundary}>} */
    export let options

    /** @type {RenderContext}*/
    let activeChildContext
    const { childFragments, isActive } = context
    const { decorator, props } = options

    const recursiveDecorators = context.decorators.filter(deco => deco.recursive)
    const newDecorators = pushToOrReplace(recursiveDecorators, decorator)
        .filter(Boolean)
        .map(normalizeDecorator)

    const folderDecoraterPromise = addFolderDecorator(newDecorators, context)

    let childContexts = buildChildContexts(options, context, newDecorators)

    // if parent changes status to inactive, so does children
    $: if (!$isActive) childContexts.forEach(cc => cc.isActive.set(false))

    $: $childFragments.length &&
        ({ activeChildContext, childContexts } = handlePageChange(
            $childFragments,
            childContexts,
        ))
    $: updateVisibility(childContexts, activeChildContext)

    /**
     * @param {RouteFragment[]} fragments
     * @param {RenderContext[]} _childContexts
     */
    const handlePageChange = (fragments, _childContexts, rebuild) => {
        const [fragment, ...childFragments] = fragments
        const _activeChildContext = findActiveChildContext(_childContexts, fragment)

        if (!_activeChildContext) {
            if (rebuild) handleRebuildError(context, _childContexts)

            // if we're rendering a node that didn't exist at this level before, we need to rebuild the child contexts
            // this happens when navigating in or out of a reset module
            _childContexts = buildChildContexts(options, context, newDecorators)

            return handlePageChange(fragments, _childContexts, true)
        }

        // if we're traversing down the tree, we need to set all old child fragments to inactive
        const setInactive = cf => cf.renderContext.then(rc => rc.isActive.set(false))
        if (!childFragments.length)
            get(_activeChildContext.childFragments).forEach(setInactive)

        _activeChildContext.fragment = fragment
        _activeChildContext.childFragments.set(childFragments)
        _activeChildContext.route = fragments[0].route
        fragment.renderContext.resolve(_activeChildContext)

        return { activeChildContext: _activeChildContext, childContexts: _childContexts }
    }
</script>

{#await folderDecoraterPromise then}
    {#each childContexts as context (context)}
        <RenderFragment {context} {props} />
    {/each}
{/await}
