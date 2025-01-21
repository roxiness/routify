<script>
    import { onMount as _onMount } from 'svelte'
    import { RenderContext } from '../renderer/RenderContext.js'

    /** @type {RouterContext|RenderContext} */
    export let context

    const location = context.anchorLocation

    /** @type {(parent: Node, anchor?: Node)=>any} */
    export let onMount = x => x

    const isSpa = !import.meta.env.ROUTIFY_SSR_ENABLE

    /** @type {HTMLElement} */
    let elem

    let mounted = false

    // check if context is a routercontext
    const name =
        context instanceof RenderContext
            ? context.node.name || 'unnamed'
            : context.router.name || 'defaultRouter'

    /** @param {HTMLElement} elem */
    const nextValidSibling = elem => {
        const next = /** @type {HTMLElement}*/ (elem.nextElementSibling)
        if ('routifyAnchorBackstop' in next.dataset) {
            console.warn('found no children in', elem.parentElement)
            throw new Error(
                'AnchorLocation is set to firstChild, but no children were found',
            )
        }
        return next && 'routifyAnchorLocator' in next.dataset
            ? nextValidSibling(next)
            : next
    }

    const handlers = {
        /**
         * Wraps an anchor element around the node
         */
        wrapper: elem => {
            elem.dataset.routifyAnchorWrapper = name
            onMount(elem)
        },
        /**
         * Uses the parent element as the node's anchor
         * Note that if multiple nodes use the same parent, they will share the same anchor
         */
        parent: elem => {
            elem.dataset.routifyAnchorParent = name
            onMount(elem.parentElement)
        },
        /**
         * Creates an anchor element before the node
         */
        header: elem => {
            elem.dataset.routifyAnchorHeader = name
            onMount(elem.parentElement, elem)
        },
        /**
         * Uses the first element of the node as the anchor
         */
        firstChild: elem => {
            const nextSib = nextValidSibling(elem)
            nextSib.dataset.routifyAnchorNextSibling = name
            onMount(elem.parentElement, nextSib)
        },
        /**
         * Uses a custom function to determine the anchor
         */
        custom: elem => {
            // @ts-ignore location is a function
            const res = location(elem)
            res.dataset.routifyAnchorCustom = name
            if (res.dataset.hasOwnProperty('routifyAnchorLocator')) {
                const warn = `Selected anchor element is an anchor locator. Use '!elem.dataset.hasOwnProperty("routifyAnchorLocator")' to ensure a valid selection.`
                ;(context['node'] || context.router).log.warn(warn)
            }

            onMount(elem.parentElement, res)
        },
    }

    _onMount(() => {
        if (mounted) return
        const handlerName = typeof location === 'function' ? 'custom' : location
        if (!handlers[handlerName])
            throw new Error(
                `Anchor location "${handlerName}" is not valid. Wrapper options: 'wrapper', 'parent', 'header', 'firstChild', or a function that returns a valid element.`,
            )
        const handler = handlers[handlerName]
        handler(elem)
        mounted = true // only works if firstchild is synchronous
    })
</script>

{#if location === 'wrapper'}
    <div data-routify-anchor-wrapper={name} bind:this={elem} {...$$restProps}>
        <slot />
    </div>
{:else if location === 'header'}
    <div data-routify-anchor-header={name} bind:this={elem} {...$$restProps}>
        <!-- routify anchor header -->
    </div>
    <slot />
{:else}
    <!-- parent, firstChild or custom -->
    {#if !mounted && isSpa}
        <div data-routify-anchor-locator class="anchor" bind:this={elem} {...$$restProps}>
            <!-- routify anchor locator -->
        </div>
    {/if}
    <slot />

    {#if !mounted && isSpa}
        <div class="anchor-backstop" data-routify-anchor-backstop>
            <!-- routify anchor backstop -->
        </div>
    {/if}
{/if}
