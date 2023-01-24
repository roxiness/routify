<script>
    import { createSequenceHooksCollection } from 'hookar'

    import { get, writable } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment.js'
    import { pushToOrReplace } from '../utils/index.js'
    import RenderFragment from './RenderFragment.svelte'
    import { normalizeMulti } from './utils/normalizeMulti.js'

    /** @type {RenderContext}*/
    export let context = null
    /** @type {{multi: MultiInput, decorator:SvelteComponentTyped , props, options, anchor: AnchorLocation}} */
    export let options

    /** @type {RenderContext}*/
    let activeContext
    const { childFragments, isActive, decorators, route } = context
    const {
        multi: multiInput,
        decorator,
        props,
        anchor: anchorLocation,
        options: _options,
    } = options


    /** @param {RNodeRuntime} node*/
    const getChildIndex = node => node.children.find(node => node.name === 'index')

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
            router: $childFragments[0]?.route.router || context.router,
            route: null,
            parentContext: context,
            onDestroy: createSequenceHooksCollection(),
            decorators: pushToOrReplace(decorators, decorator).filter(Boolean),
            options: _options || {},
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
        // todo we should match node, not node.id. For some reason node instances are different
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
        // todo issue is caused by routify:meta reset in modules/index.md

        // set this sibling to active and all other to inactive
        childContexts.forEach(childContext => {
            const notExcludedCtx = context => !context?.node?.meta.multi?.exclude
            const isPartOfPage = () =>
                !get(activeContext.single) &&
                !get(childContext.single) &&
                [childContext, activeContext].every(notExcludedCtx)

            const isActive = childContext === activeContext
            const wasActive = get(childContext.isActive)
            if (wasActive != isActive) childContext.isActive.set(isActive)

            const isVisible = isActive || isPartOfPage()
            const wasVisible = get(childContext.isVisible)
            if (wasVisible != isVisible) childContext.isVisible.set(isVisible)
        })
        childContexts = childContexts
    }

    $: $childFragments.length && handlePageChange($childFragments)
</script>

{#each childContexts as context (context.node.id)}
    <RenderFragment {context} {props} {activeContext} />
{/each}
