<script>
    import { createSequenceHooksCollection } from 'hookar'

    import { get, writable } from 'svelte/store'
    import { RouteFragment } from '../Route/RouteFragment.js'
    import { pushToOrReplace } from '../utils/index.js'
    import RenderFragment from './RenderFragment.svelte'
    import {
        normalizeDecorator,
        coerceInlineInputToObject,
        normalizeInline,
    } from './utils/normalizeDecorator.js'
    export const isRoot = undefined

    /** @type {RenderContext}*/
    export let context = null

    /** @type {{inline: InlineInput, decorator:DecoratorInput, props, options, anchor: AnchorLocation, scrollBoundary: scrollBoundary}} */
    export let options

    const environment = typeof window !== 'undefined' ? 'browser' : 'ssr'

    /** @type {RenderContext}*/
    let activeContext
    const { childFragments, isActive, route } = context
    const {
        inline: rawInlineInput,
        decorator,
        props,
        anchor: anchorLocation,
        options: _options,
        scrollBoundary = () => get(context.parentContext?.elem)?.parent,
    } = options

    /** @param {RNodeRuntime} node*/
    const getChildIndex = node => node.children.find(node => node.name === 'index')

    const recursiveDecorators = context.decorators.filter(deco => deco.recursive)
    const newDecorators = pushToOrReplace(recursiveDecorators, decorator)
        .filter(Boolean)
        .map(normalizeDecorator)

    const folderDecorator = context?.node?.children.find(
        node => node.name === '_decorator',
    )

    const addFolderDecorator = (decorators, folderDecorator) => {
        const options = folderDecorator.module.options || {}
        decorators.push({
            component: folderDecorator.module.default,
            recursive: options.recursive ?? folderDecorator.meta.recursive ?? true,
            shouldRender: options.shouldRender ?? (() => true),
        })
    }

    /**     *
     * @param {RNodeRuntime} node
     */
    const nodeIsIndexed = node =>
        // same as node.pagesWithIndex, except includes dynamic pages
        !node.meta.fallback && !node.name.startsWith('_') && node.meta?.order !== false

    let wait = false

    if (folderDecorator) {
        // @ts-ignore
        if (folderDecorator.module) addFolderDecorator(newDecorators, folderDecorator)
        else {
            wait = true
            folderDecorator.loadModule().then(() => {
                addFolderDecorator(newDecorators, folderDecorator)
                wait = false
            })
        }
    }

    /** @returns {RenderContext[] }*/
    const buildChildContexts = () => {
        const refNode = $childFragments[0]?.node
        const parentNode = context?.node || refNode.parent

        const matches = parentNode
            ? parentNode.children.filter(node => node === refNode || nodeIsIndexed(node))
            : [refNode]

        const children = matches.length ? matches : [refNode]

        return children.map(node => ({
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
            isInline: writable(false),
            elem: writable(null),
            router: $childFragments[0]?.route?.router || context.router,
            route: null,
            parentContext: context,
            onDestroy: createSequenceHooksCollection(),
            decorators: newDecorators,
            options: _options || {},
            scrollBoundary,
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

    const lazySet = (store, value) =>
        JSON.stringify(get(store)) !== JSON.stringify(value) && store.set(value)

    const isInline = _context => {
        const inlineInput = {
            ...coerceInlineInputToObject(rawInlineInput),
            ...coerceInlineInputToObject(_context?.node.meta.inline),
        }
        const inlineCfg = normalizeInline(inlineInput)

        const passedCallback =
            !_context?.node || inlineCfg.callback(_context?.node, activeContext)

        return passedCallback && ['always', environment].includes(inlineCfg.context)
    }

    /** @param {RenderContext[]} childContexts */
    const setVisibility = childContexts => {
        childContexts.forEach(context => {
            const inlined = isInline(context)
            const isBothInlined = inlined && isInline(activeContext)

            lazySet(context.isInline, inlined)
            lazySet(context.isActive, context === activeContext)
            lazySet(context.isVisible, get(context.isActive) || isBothInlined)
        })
    }

    $: $childFragments.length && handlePageChange($childFragments)
    $: setVisibility(childContexts)
</script>

{#if !wait}
    {#each childContexts as context (context.node.id)}
        <RenderFragment {context} {props} />
    {/each}
{/if}
