<script>
    import { get } from 'svelte/store'
    import { pushToOrReplace } from '../utils/index.js'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeDecorator, normalizeWrapper } from './utils/normalizeDecorator.js'
    import { handleRebuildError } from '../utils/messages.js'
    import {
        addFolderDecorator,
        addFolderWrapper,
        findActiveChildContext,
    } from './composeFragments.js'

    /** @type {RenderContext|RouterContext}*/
    export let context

    /** @type {RenderContextOptions} */
    export let options

    let oldOptions = null
    let optionsChangeCounter = 1
    $: {
        const { props: _props, ...optionsWithoutProps } = options
        const jsonOptions = JSON.stringify(optionsWithoutProps)
        optionsChangeCounter =
            jsonOptions !== oldOptions ? optionsChangeCounter + 1 : optionsChangeCounter
        oldOptions = jsonOptions
    }

    const { childFragments } = context
    const { decorator } = options
    const inlineWrapper =
        options.inline?.['wrapper'] && normalizeWrapper(options.inline['wrapper'])

    const recursiveDecorators = context.decorators.filter(deco => deco.recursive)
    const newDecorators = pushToOrReplace(recursiveDecorators, [decorator, inlineWrapper])
        .filter(Boolean)
        .map(normalizeDecorator)

    let decoratorsReady = !addFolderDecorator(newDecorators, context)?.then(() => {
        decoratorsReady = true
    })
    let wrappersReady = !addFolderWrapper(newDecorators, context)?.then(() => {
        wrappersReady = true
    })
    $: if (optionsChangeCounter) buildChildContexts()

    const buildChildContexts = () => context.buildChildContexts(options, newDecorators)

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

    $: _handleChildren(optionsChangeCounter && $childFragments)
</script>

{#each $childContexts.filter(cc => decoratorsReady && wrappersReady && get(cc.isVisible)) as context (context)}
    <RenderFragment {context} />
{/each}
