<script>
    import { createSequenceHooksCollection } from 'hookar'

    import { get, writable } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment.js'
    import { pushToOrReplace } from '../utils/index.js'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeMulti } from './utils/normalizeMulti.js'

    /** @type {RenderContext}*/
    export let context = null

    /** @type {{multi: MultiInput, decorator:DecoratorInput, props, options, anchor: AnchorLocation, scrollBoundary: scrollBoundary}} */
    export let options

    const environment = typeof window !== 'undefined' ? 'browser' : 'ssr'
    const decoratorDefaults = { recursive: true }

    /** @type {RenderContext}*/
    let activeContext
    const { childFragments, isActive, decorators, route } = context
    const {
        multi: multiInput,
        decorator,
        props,
        anchor: anchorLocation,
        options: _options,
        scrollBoundary = elem => elem.parentElement,
    } = options

    /**
     * @param {DecoratorInput} decorator
     * @returns {Decorator}
     */
    const normalizeDecorator = decorator => {
        if ('component' in decorator) return { ...decoratorDefaults, ...decorator }
        else return { ...decoratorDefaults, component: decorator }
    }

    /** @param {RNodeRuntime} node*/
    const getChildIndex = node => node.children.find(node => node.name === 'index')

    const newDecorators = decorators.filter(
        deco =>
            (!context?.node?.module?.default && !context?.node?.asyncModule) ||
            deco.recursive,
    )

    /** @returns {RenderContext[] }*/
    const buildChildContexts = () => {
        const multi = normalizeMulti(multiInput, $childFragments[0]?.node, context)
        return multi.pages.map(node => ({
            anchorLocation: anchorLocation || 'parent',
            childFragments: writable(
                getChildIndex(node)
                    ? [new RouteFragment(route, getChildIndex(node))]
                    : [],
            ),
            node,
            fragment: new RouteFragment(route, node, null, {}),
            isActive: writable(false),
            isVisible: writable(false),
            elem: writable(null),
            router: $childFragments[0]?.route?.router || context.router,
            route: null,
            parentContext: context,
            onDestroy: createSequenceHooksCollection(),
            decorators: pushToOrReplace(newDecorators, decorator)
                .filter(Boolean)
                .map(normalizeDecorator),
            options: _options || {},
            scrollBoundary,
            multi,
            single: writable(multi.single),
        }))
    }

    let childContexts = buildChildContexts()

    // if parent changes status to inactive, so does children
    $: if (!$isActive) childContexts.forEach(cc => cc.isActive.set(false))

    /**
     * @param {RouteFragment[]} fragments
     */
    const handlePageChange = fragments => {
        const [fragment, ...childFragments] = [...fragments]
        activeContext = childContexts.find(s => s.node === fragment?.node)
        if (!activeContext) {
            // if we're rendering a node that didn't exist at this level before, we need to rebuild the child contexts
            // this happens when navigating in or out of a reset module
            childContexts = buildChildContexts()
            return handlePageChange(fragments)
        }

        activeContext.fragment = fragment
        activeContext.childFragments.set(childFragments)
        activeContext.route = fragments[0].route

        childContexts = childContexts
    }

    /** @param {RenderContext[]} childContexts */
    const setVisibility = childContexts => {
        childContexts.forEach(context => {
            const notExcludedCtx = context => !context?.node?.meta.multi?.exclude
            const isPartOfPage = () =>
                // if this isn't part of the active route, activeContext is undefined
                !get(activeContext?.single) &&
                !get(context.single) &&
                [context, activeContext].every(notExcludedCtx) &&
                ['always', environment].includes(context.multi?.renderInactive)

            const isActive = context === activeContext
            const wasActive = get(context.isActive)
            if (wasActive != isActive) context.isActive.set(isActive)

            const isVisible = isActive || isPartOfPage()
            const wasVisible = get(context.isVisible)
            if (wasVisible != isVisible) context.isVisible.set(isVisible)
        })
    }

    $: $childFragments.length && handlePageChange($childFragments)
    $: setVisibility(childContexts)
</script>

{#each childContexts as context (context.node.id)}
    <RenderFragment {context} {props} />
{/each}
